-- =========================================================
-- Elimina el usuario avcharianroberto@gmail.com
-- Borrar de auth.users elimina en cascada su fila en
-- public.usuarios automáticamente.
--
-- Si tira error de foreign key, significa que ese usuario
-- ya tiene clientes/tareas/licitaciones cargadas a su nombre
-- y hay que reasignarlas antes de borrar (avisame si pasa).
-- =========================================================

delete from auth.users
where email = 'avcharianroberto@gmail.com';

-- Verificación (no debería devolver filas)
select * from public.usuarios where email = 'avcharianroberto@gmail.com';
