-- =========================================================
-- DIAGNÓSTICO COMPLETO — Tomás Civelli
-- Muestra TODAS sus cuentas y TODO el histórico de patrimonio,
-- no solo abril, para encontrar de dónde viene la duplicación.
-- =========================================================

-- 1) Confirmar cuál es el cliente exacto (por si hay más de uno con nombre similar)
select id, nombre, apellido, tipo, estado from public.clientes
where nombre ilike '%Civelli%' or apellido ilike '%Civelli%';

-- 2) Todas las cuentas que tiene asociadas (y si son mancomunadas, con quién)
select cu.id as cuenta_id, cu.numero_cuenta, cu.plaza, cu.estado_cuenta, ct.rol_titular, c.nombre, c.apellido
from public.cuenta_titulares ct
join public.cuentas cu on cu.id = ct.cuenta_id
join public.clientes c on c.id = ct.cliente_id
where cu.numero_cuenta in (
  select cu2.numero_cuenta from public.cuentas cu2
  join public.cuenta_titulares ct2 on ct2.cuenta_id = cu2.id
  join public.clientes c2 on c2.id = ct2.cliente_id
  where c2.nombre ilike '%Civelli%' or c2.apellido ilike '%Civelli%'
)
order by cu.numero_cuenta;

-- 3) TODO el histórico de patrimonio de esas cuentas (todas las fechas)
select p.fecha_carga, p.numero_cuenta, p.aum, p.cash, p.id
from public.patrimonio p
where p.numero_cuenta in (
  select cu.numero_cuenta from public.cuentas cu
  join public.cuenta_titulares ct on ct.cuenta_id = cu.id
  join public.clientes c on c.id = ct.cliente_id
  where c.nombre ilike '%Civelli%' or c.apellido ilike '%Civelli%'
)
order by p.numero_cuenta, p.fecha_carga;
