-- El login con correo+contraseña antes de descargar resultó ser mucha fricción para el
-- personal de campo. Se reemplaza por pedir solo el correo (sin contraseña ni
-- confirmación) — deja de requerir una cuenta real de Supabase Auth para descargar, así
-- que ya no hay auth.uid() disponible al insertar esta fila. user_id queda como
-- referencia histórica (los registros hechos durante la Fase 2.1 sí lo tienen).

alter table public.download_log
  alter column user_id drop not null,
  add column email text;

drop policy "Users can insert their own download log" on public.download_log;

create policy "Anyone can log a download" on public.download_log
  for insert with check (true);
