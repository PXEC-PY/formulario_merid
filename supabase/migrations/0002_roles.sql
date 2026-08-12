-- Fase 2 de acceso — roles, departamentos, panel de administración y auditoría.
-- Documentación versionada; se corre a mano en el SQL Editor de Supabase Studio.

create type public.app_role as enum ('super_admin', 'administrador', 'empleado', 'usuario');

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column role public.app_role not null default 'usuario',
  add column department_id uuid references public.departments(id) on delete set null,
  add column email text;

update public.profiles p set email = u.email from auth.users u where u.id = p.id;

-- Rompe la recursión de RLS: lee el rol del que llama sin volver a evaluar policies.
create function public.current_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Los admins pueden ver y editar el rol/departamento de cualquiera.
create policy "Admins can view all profiles" on public.profiles
  for select using (public.current_role() in ('super_admin', 'administrador'));
create policy "Admins can update any profile" on public.profiles
  for update using (public.current_role() in ('super_admin', 'administrador'));

alter table public.departments enable row level security;

create policy "Authenticated can view departments" on public.departments
  for select to authenticated using (true);
create policy "Admins manage departments" on public.departments
  for all using (public.current_role() in ('super_admin', 'administrador'));

-- Nadie (ni admins desde la app) puede escalar su propio rol/departamento, ni asignar
-- Super Admin. Las ediciones manuales por SQL Editor no pasan por una sesión de Auth
-- (auth.uid() es null ahí), así que este trigger no las bloquea.
create function public.guard_profile_role_changes()
returns trigger as $$
begin
  if public.current_role() is distinct from 'super_admin'
     and public.current_role() is distinct from 'administrador' then
    new.role := old.role;
    new.department_id := old.department_id;
  end if;
  if new.role = 'super_admin' and old.role is distinct from 'super_admin' then
    raise exception 'Super Admin no se puede asignar desde la aplicación.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger before_profile_update_guard
  before update on public.profiles
  for each row execute function public.guard_profile_role_changes();

-- Tope de 2 Super Admin, se aplica siempre (incluida la asignación manual en la base).
create function public.enforce_super_admin_cap()
returns trigger as $$
begin
  if new.role = 'super_admin'
     and (select count(*) from public.profiles where role = 'super_admin' and id <> new.id) >= 2 then
    raise exception 'Ya existen 2 Super Admin — no se puede asignar otro.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger before_profile_role_cap
  before insert or update of role on public.profiles
  for each row execute function public.enforce_super_admin_cap();

-- Auditoría: quién hizo qué.
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  target_profile_id uuid references public.profiles(id),
  details jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create policy "Admins can view audit log" on public.audit_log
  for select using (public.current_role() in ('super_admin', 'administrador'));
-- Sin policies de insert/update/delete para clientes: solo escriben los triggers
-- (corren security definer y no dependen de RLS).

create function public.log_profile_changes()
returns trigger as $$
begin
  if new.role is distinct from old.role or new.department_id is distinct from old.department_id then
    insert into public.audit_log (actor_id, action, target_profile_id, details)
    values (auth.uid(), 'role_or_department_change', new.id,
      jsonb_build_object('old_role', old.role, 'new_role', new.role,
                          'old_department_id', old.department_id, 'new_department_id', new.department_id));
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger after_profile_update_log
  after update on public.profiles
  for each row execute function public.log_profile_changes();

-- Extiende el trigger de alta de Fase 1 para guardar email y loguear el signup.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.email);
  insert into public.audit_log (actor_id, action, target_profile_id, details)
  values (new.id, 'user_signup', new.id, jsonb_build_object('email', new.email));
  return new;
end;
$$ language plpgsql security definer set search_path = public;
