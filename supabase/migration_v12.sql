-- =========================================================
-- MIGRACIÓN V12 — arancel (%) por licitación, para calcular
-- la comisión estimada sobre el monto confirmado.
-- =========================================================
alter table public.licitaciones
  add column if not exists arancel_pct numeric(6,3);
