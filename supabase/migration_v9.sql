-- =========================================================
-- MIGRACIÓN V9 — vistas que ya vienen sumadas desde la base
-- Esto evita traer todas las filas de comisiones a la app
-- solo para sumarlas ahí; la suma la hace Postgres, que es
-- mucho más rápido para esto.
-- =========================================================

-- Total de comisiones por mes (todas, sin importar cliente)
create view public.v_comisiones_por_mes
with (security_invoker = true) as
select periodo_mes, periodo_anio, sum(monto) as total, count(*) as operaciones
from public.comisiones
group by periodo_mes, periodo_anio;

-- Total de comisiones por cliente y por mes (pasa por cuenta_titulares,
-- así las cuentas mancomunadas suman a los dos titulares)
create view public.v_comisiones_por_cliente_mes
with (security_invoker = true) as
select
  ct.cliente_id,
  c.periodo_mes,
  c.periodo_anio,
  sum(c.monto) as total,
  count(*) as operaciones
from public.comisiones c
join public.cuentas cu on cu.numero_cuenta = c.comitente
join public.cuenta_titulares ct on ct.cuenta_id = cu.id
group by ct.cliente_id, c.periodo_mes, c.periodo_anio;

-- Total de comisiones sin cliente (premios al asesor, comitente vacío)
create view public.v_comisiones_sin_cliente_por_mes
with (security_invoker = true) as
select periodo_mes, periodo_anio, sum(monto) as total, count(*) as operaciones
from public.comisiones
where comitente is null
group by periodo_mes, periodo_anio;
