-- =========================================================
-- PASO 1: VER qué se va a borrar (todo abril 2026, Civelli)
-- =========================================================
select p.id, p.fecha_carga, p.numero_cuenta, p.aum, p.cash
from public.patrimonio p
where p.numero_cuenta in (
  select cu.numero_cuenta
  from public.cuentas cu
  join public.cuenta_titulares ct on ct.cuenta_id = cu.id
  join public.clientes c on c.id = ct.cliente_id
  where c.nombre ilike '%Civelli%' or c.apellido ilike '%Civelli%'
)
and p.fecha_carga between '2026-04-01' and '2026-04-30'
order by p.numero_cuenta;

-- =========================================================
-- PASO 2: BORRAR todo abril 2026 para Civelli
-- =========================================================
delete from public.patrimonio
where numero_cuenta in (
  select cu.numero_cuenta
  from public.cuentas cu
  join public.cuenta_titulares ct on ct.cuenta_id = cu.id
  join public.clientes c on c.id = ct.cliente_id
  where c.nombre ilike '%Civelli%' or c.apellido ilike '%Civelli%'
)
and fecha_carga between '2026-04-01' and '2026-04-30';
