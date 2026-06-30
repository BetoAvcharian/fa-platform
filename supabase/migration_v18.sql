-- =========================================================
-- MIGRACIÓN V18 — agrega permisos de borrado/edición que
-- faltaban en "patrimonio", y vuelve a asegurar el de
-- "cuentas" (por si la v14 no había quedado bien aplicada).
-- Seguro de correr aunque ya hayas corrido v14 antes.
-- =========================================================

-- ---------------------------------------------------------
-- PATRIMONIO: faltaban los permisos de editar y borrar
-- ---------------------------------------------------------
drop policy if exists patrimonio_update on public.patrimonio;
drop policy if exists patrimonio_delete on public.patrimonio;

create policy patrimonio_update on public.patrimonio for update using (
  public.fn_rol() = 'admin'
  or numero_cuenta in (
    select cu.numero_cuenta
    from public.cuentas cu
    join public.cuenta_titulares ct on ct.cuenta_id = cu.id
    join public.clientes c on c.id = ct.cliente_id
    where c.owner_id = auth.uid()
       or (public.fn_rol() = 'manager' and c.owner_id in (select public.fn_equipo(auth.uid())))
  )
) with check (true);

create policy patrimonio_delete on public.patrimonio for delete using (
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

-- ---------------------------------------------------------
-- CUENTAS: reafirmar el permiso de borrado (por si quedó
-- desactualizado)
-- ---------------------------------------------------------
drop policy if exists cuentas_delete on public.cuentas;

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
