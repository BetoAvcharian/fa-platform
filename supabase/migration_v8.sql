-- =========================================================
-- MIGRACIÓN V8 — corrige el error al crear cuentas
-- (el permiso de "ver" exigía que ya tuviera un titular
-- vinculado, lo cual es imposible en el instante de crearla)
-- =========================================================

drop policy if exists cuentas_select on public.cuentas;
drop policy if exists cuentas_modify on public.cuentas;

create policy cuentas_select on public.cuentas for select using (auth.role() = 'authenticated');
create policy cuentas_modify on public.cuentas for all using (auth.role() = 'authenticated') with check (true);
