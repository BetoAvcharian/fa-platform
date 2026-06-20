-- =========================================================
-- MIGRACIÓN V7
-- 1) Una cuenta puede tener 1 o 2 titulares (tabla intermedia)
-- 2) Borra TODOS los datos de prueba/import anteriores (limpio)
-- =========================================================

-- ---------------------------------------------------------
-- 1) LIMPIEZA TOTAL (todo era de prueba, confirmado)
-- ---------------------------------------------------------
truncate table public.licitacion_ordenes cascade;
truncate table public.licitaciones cascade;
truncate table public.historial_cliente cascade;
truncate table public.comisiones cascade;
truncate table public.tareas cascade;
truncate table public.interacciones cascade;
truncate table public.kyc cascade;
truncate table public.patrimonio cascade;
truncate table public.cuentas cascade;
truncate table public.clientes cascade;

-- ---------------------------------------------------------
-- 2) NUEVA TABLA: cuenta_titulares (relación N a N)
-- ---------------------------------------------------------
create table public.cuenta_titulares (
  cuenta_id uuid not null references public.cuentas(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  rol_titular text not null default 'titular', -- 'titular' o 'cotitular'
  primary key (cuenta_id, cliente_id)
);
create index idx_cuenta_titulares_cliente on public.cuenta_titulares(cliente_id);

alter table public.cuenta_titulares enable row level security;
create policy cuenta_titulares_select on public.cuenta_titulares for select using (
  cliente_id in (select id from public.clientes)
);
create policy cuenta_titulares_modify on public.cuenta_titulares for all using (
  cliente_id in (select id from public.clientes)
) with check (
  cliente_id in (select id from public.clientes)
);

-- ---------------------------------------------------------
-- 3) SACAR la relación vieja directa cuentas.cliente_id
-- ---------------------------------------------------------
drop policy if exists cuentas_select on public.cuentas;
drop policy if exists cuentas_modify on public.cuentas;

alter table public.cuentas drop column if exists cliente_id;

create policy cuentas_select on public.cuentas for select using (
  id in (select cuenta_id from public.cuenta_titulares)
);
create policy cuentas_modify on public.cuentas for all using (
  id in (select cuenta_id from public.cuenta_titulares)
) with check (true);

-- ---------------------------------------------------------
-- 4) RLS de kyc/interacciones que dependían de cuentas.cliente_id
--    (interacciones depende de clientes directo, no cambia;
--     kyc depende de cuenta_id -> ahora cuentas no tiene cliente_id,
--     se mantiene visible si la cuenta es visible)
-- ---------------------------------------------------------
drop policy if exists kyc_select on public.kyc;
drop policy if exists kyc_modify on public.kyc;
create policy kyc_select on public.kyc for select using (
  cuenta_id in (select id from public.cuentas)
);
create policy kyc_modify on public.kyc for all using (
  cuenta_id in (select id from public.cuentas)
) with check (
  cuenta_id in (select id from public.cuentas)
);
