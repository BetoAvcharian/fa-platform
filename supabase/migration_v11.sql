-- =========================================================
-- MIGRACIÓN V11 — número de comitente en cada orden de licitación
-- =========================================================
alter table public.licitacion_ordenes
  add column if not exists comitente text;
