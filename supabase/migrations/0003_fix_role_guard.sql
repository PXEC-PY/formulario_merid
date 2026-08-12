-- Corrige un bug de 0002_roles.sql: guard_profile_role_changes() usaba "is distinct
-- from" contra current_role(), que devuelve NULL fuera de una sesión de Auth (SQL
-- Editor). "NULL is distinct from 'x'" es TRUE, así que el trigger revertía también
-- las ediciones manuales que debía dejar pasar — incluida la asignación de Super Admin.
-- Ahora todo el guardado queda condicionado a que haya una sesión de Auth real
-- (auth.uid() not null); sin sesión (edición manual por SQL), el trigger no hace nada.

create or replace function public.guard_profile_role_changes()
returns trigger as $$
begin
  if auth.uid() is not null then
    if public.current_role() not in ('super_admin', 'administrador') then
      new.role := old.role;
      new.department_id := old.department_id;
    end if;
    if new.role = 'super_admin' and old.role is distinct from 'super_admin' then
      raise exception 'Super Admin no se puede asignar desde la aplicación.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;
