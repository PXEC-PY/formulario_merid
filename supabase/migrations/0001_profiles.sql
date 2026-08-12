-- Fase 1 de acceso — tabla de perfiles, 1:1 con auth.users.
-- Este archivo es documentación versionada; se corre a mano en el SQL Editor de
-- Supabase Studio (no hay credenciales de Postgres en este repo ni en la app).

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- "Nunca confiar solo en el frontend": estas reglas las aplica Postgres, no React.
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Crea automáticamente la fila de perfil apenas alguien se registra, tomando
-- nombre/apellido de los metadatos que manda signUp() desde el frontend.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
