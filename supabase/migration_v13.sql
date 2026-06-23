-- =========================================================
-- MIGRACIÓN V13 — comisiones totalizadas por comitente
-- (cuenta completa, sin dividir entre cotitulares — para la
-- vista "Por Cuenta" en Reportes)
-- =========================================================
create view public.v_comisiones_por_comitente_mes
with (security_invoker = true) as
select comitente, periodo_mes, periodo_anio, sum(monto) as total, count(*) as operaciones
from public.comisiones
where comitente is not null
group by comitente, periodo_mes, periodo_anio;
