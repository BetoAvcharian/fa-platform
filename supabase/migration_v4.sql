-- =========================================================
-- MIGRACIÓN V4 — campo "Referenciado por"
-- =========================================================
alter table public.clientes
  add column if not exists referenciado_por text;
