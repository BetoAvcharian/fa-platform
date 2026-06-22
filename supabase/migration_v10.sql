-- =========================================================
-- MIGRACIÓN V10 — corrige doble conteo de cuentas mancomunadas
-- en el total agregado de comisiones por cliente.
-- Antes: una cuenta con 2 titulares sumaba el monto completo
-- a cada uno (duplicado). Ahora: se divide entre la cantidad
-- de titulares de esa cuenta.
-- =========================================================

create or replace view public.v_comisiones_por_cliente_mes
with (security_invoker = true) as
select
  ct.cliente_id,
  c.periodo_mes,
  c.periodo_anio,
  sum(c.monto / nt.cantidad_titulares) as total,
  count(*) as operaciones
from public.comisiones c
join public.cuentas cu on cu.numero_cuenta = c.comitente
join public.cuenta_titulares ct on ct.cuenta_id = cu.id
join (
  select cuenta_id, count(*) as cantidad_titulares
  from public.cuenta_titulares
  group by cuenta_id
) nt on nt.cuenta_id = cu.id
group by ct.cliente_id, c.periodo_mes, c.periodo_anio;
