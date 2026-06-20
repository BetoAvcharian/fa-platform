-- =========================================================
-- MIGRACIÓN V5 — flag "trabajando" para prospectos
-- =========================================================
alter table public.clientes
  add column if not exists prospecto_trabajando boolean default false;
