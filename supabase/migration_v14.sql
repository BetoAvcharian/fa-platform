-- =========================================================
-- MIGRACIÓN V14 — CRÍTICA: aísla los datos por dueño real
--
-- Hasta ahora, "cuentas" estaba con permiso abierto a
-- cualquier usuario logueado (para resolver un bug anterior),
-- y "patrimonio" venía así desde el esquema original. Esto
-- hacía que un FA viera el AUM y las cuentas de TODOS los
-- usuarios, no solo las propias. También hacía más lenta la
-- app a medida que crecía la base (cada consulta traía todo).
--
-- Esta migración:
-- 1) Restringe "cuentas" y "patrimonio" para que cada uno
--    solo vea lo que le corresponde (lo suyo, lo de su equipo
--    si es Manager, o todo si es Admin).
-- 2) No rompe el alta de cuentas nuevas (el bug que arreglamos
--    antes) porque el código ahora NO necesita "ver" la fila
--    recién creada para saber su id (se genera el id antes
--    de insertar, así no hace falta volver a leerla).
-- =========================================================

-- ---------------------------------------------------------
-- CUENTAS
-- ---------------------------------------------------------
drop policy if exists cuentas_select on public.cuentas;
drop policy if exists cuentas_modify on public.cuentas;

create policy cuentas_select on public.cuentas for select using (
  public.fn_rol() = 'admin'
  or id in (
    select ct.cuenta_id
    from public.cuenta_titulares ct
    join public.clientes c on c.id = ct.cliente_id
    where c.owner_id = auth.uid()
       or (public.fn_rol() = 'manager' and c.owner_id in (select public.fn_equipo(auth.uid())))
  )
);

-- el alta de cuentas nuevas sigue abierta a cualquier usuario logueado
-- (no hace falta "ver" lo de otros para crear una cuenta propia;
-- el control real de a quién queda vinculada lo hace cuenta_titulares,
-- que ya estaba bien restringido)
create policy cuentas_insert on public.cuentas for insert with check (auth.role() = 'authenticated');

create policy cuentas_update on public.cuentas for update using (
  public.fn_rol() = 'admin'
  or id in (
    select ct.cuenta_id
    from public.cuenta_titulares ct
    join public.clientes c on c.id = ct.cliente_id
    where c.owner_id = auth.uid()
       or (public.fn_rol() = 'manager' and c.owner_id in (select public.fn_equipo(auth.uid())))
  )
) with check (true);

create policy cuentas_delete on public.cuentas for delete using (
  public.fn_rol() = 'admin'
  or id in (
    select ct.cuenta_id
    from public.cuenta_titulares ct
    join public.clientes c on c.id = ct.cliente_id
    where c.owner_id = auth.uid()
       or (public.fn_rol() = 'manager' and c.owner_id in (select public.fn_equipo(auth.uid())))
  )
);

-- ---------------------------------------------------------
-- PATRIMONIO
-- ---------------------------------------------------------
drop policy if exists patrimonio_select on public.patrimonio;
drop policy if exists patrimonio_insert on public.patrimonio;

create policy patrimonio_select on public.patrimonio for select using (
  public.fn_rol() = 'admin'
  or numero_cuenta in (
    select cu.numero_cuenta
    from public.cuentas cu
    join public.cuenta_titulares ct on ct.cuenta_id = cu.id
    join public.clientes c on c.id = ct.cliente_id
    where c.owner_id = auth.uid()
       or (public.fn_rol() = 'manager' and c.owner_id in (select public.fn_equipo(auth.uid())))
  )
);

create policy patrimonio_insert on public.patrimonio for insert with check (auth.role() = 'authenticated');
