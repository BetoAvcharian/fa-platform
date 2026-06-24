-- =========================================================
-- PASO 1: VER los registros de patrimonio de Abril 2026
-- para Tomás Civelli (para confirmar el duplicado antes de borrar)
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
order by p.numero_cuenta, p.fecha_carga, p.id;

-- =========================================================
-- PASO 2: BORRAR duplicados — deja solo UN registro por
-- cuenta y fecha (el más viejo, por id), borra el resto.
-- Mismo alcance: solo Civelli, solo abril 2026.
-- =========================================================
with duplicados as (
  select
    p.id,
    row_number() over (
      partition by p.numero_cuenta, p.fecha_carga
      order by p.id
    ) as fila
  from public.patrimonio p
  where p.numero_cuenta in (
    select cu.numero_cuenta
    from public.cuentas cu
    join public.cuenta_titulares ct on ct.cuenta_id = cu.id
    join public.clientes c on c.id = ct.cliente_id
    where c.nombre ilike '%Civelli%' or c.apellido ilike '%Civelli%'
  )
  and p.fecha_carga between '2026-04-01' and '2026-04-30'
)
delete from public.patrimonio
where id in (select id from duplicados where fila > 1);

-- =========================================================
-- PASO 3: VERIFICAR que quedó uno solo por cuenta
-- =========================================================
select p.fecha_carga, p.numero_cuenta, p.aum, p.cash
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
