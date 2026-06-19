-- =========================================================
-- DATOS DE PRUEBA — correr DESPUÉS de schema.sql y DESPUÉS
-- de crear tu primer usuario (login una vez para que se
-- cree la fila en public.usuarios vía el trigger)
--
-- Reemplazá 'TU_USER_ID' por tu id real:
-- select id, email from auth.users;
-- =========================================================

-- clientes de ejemplo
insert into public.clientes (owner_id, tipo, nombre, apellido, email, telefono, estado, potencial_usd, fecha_ultimo_contacto, pipeline_etapa)
values
  ('TU_USER_ID', 'cliente', 'Luciano', 'Fernandez Roman', 'luciano.fr@email.com', '+54 9 11 1111-1111', 'activo', 250000, current_date - interval '10 days', 'cliente_activo'),
  ('TU_USER_ID', 'cliente', 'Franco', 'Szocs', 'franco.szocs@email.com', '+54 9 11 2222-2222', 'activo', 180000, current_date - interval '45 days', 'cliente_activo'),
  ('TU_USER_ID', 'prospecto', 'Martina', 'Gomez', 'martina.gomez@email.com', '+54 9 11 3333-3333', 'activo', 90000, current_date - interval '5 days', 'reunion'),
  ('TU_USER_ID', 'prospecto', 'Ezequiel', 'Diaz', 'ezequiel.diaz@email.com', '+54 9 11 4444-4444', 'activo', 60000, current_date - interval '70 days', 'contactado'),
  ('TU_USER_ID', 'cliente', 'Sofia', 'Lopez', 'sofia.lopez@email.com', '+54 9 11 5555-5555', 'activo', 320000, current_date - interval '95 days', 'cliente_activo');

-- cuentas (una por cliente, usando los ids recién creados)
insert into public.cuentas (cliente_id, numero_cuenta, tipo_cuenta, estado_cuenta)
select id, 'CTA-' || left(id::text, 6), 'Cuenta Comitente', 'activa' from public.clientes where owner_id = 'TU_USER_ID';

-- patrimonio histórico (3 puntos en el tiempo, por cuenta)
insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
select current_date - interval '60 days', numero_cuenta, 200000 + random()*50000, 10000 from public.cuentas
union all
select current_date - interval '30 days', numero_cuenta, 220000 + random()*50000, 12000 from public.cuentas
union all
select current_date, numero_cuenta, 250000 + random()*50000, 15000 from public.cuentas;

-- tareas
insert into public.tareas (owner_id, cliente_id, titulo, prioridad, fecha_vencimiento, estado)
select 'TU_USER_ID', id, 'Llamar para revisar cartera', 'alta', current_date + interval '2 days', 'pendiente'
from public.clientes where owner_id = 'TU_USER_ID' limit 2;

-- interacciones
insert into public.interacciones (cliente_id, usuario_id, tipo, asunto, detalle)
select id, 'TU_USER_ID', 'llamada', 'Seguimiento trimestral', 'Revisamos performance de la cartera y se mostró conforme.'
from public.clientes where owner_id = 'TU_USER_ID' limit 3;
