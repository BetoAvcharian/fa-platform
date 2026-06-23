-- =========================================================
-- MIGRACIÓN V15 — arregla el borrado de clientes/prospectos
-- Antes solo Admin podía eliminar. Ahora también puede el
-- dueño del cliente, y el Manager de su equipo.
-- =========================================================
drop policy if exists clientes_delete on public.clientes;

create policy clientes_delete on public.clientes for delete using (
  owner_id = auth.uid()
  or public.fn_rol() = 'admin'
  or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
);
