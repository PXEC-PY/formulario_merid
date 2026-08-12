-- Fase 2.1 — registro de cada descarga (PDF o zip de fotos) para trazabilidad, ya que
-- los formularios volvieron a ser de acceso libre y el login solo se pide justo antes
-- de descargar. Documentación versionada; se corre a mano en el SQL Editor de Supabase.

create table public.download_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id),
  form_id text not null,
  kind text not null,
  ip text,
  country_code text,
  country_name text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.download_log enable row level security;

create policy "Users can insert their own download log" on public.download_log
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Admins can view download log" on public.download_log
  for select using (public.current_role() in ('super_admin', 'administrador'));
