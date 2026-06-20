-- =========================================================
-- CARGA DE DATOS REALES: Clientes (CLIENTES.xlsx) + Prospectos
-- Inserta fila por fila (DO block) para evitar cualquier
-- ambigüedad de matching entre clientes con nombres repetidos
-- (hay 3 personas con cuenta local + internacional separadas).
-- Todo se asigna al usuario admin avcharian1999@gmail.com.
-- =========================================================

do $$
declare
  v_owner uuid;
  v_cliente_id uuid;
begin
  select id into v_owner from public.usuarios where email = 'avcharian1999@gmail.com';

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SIED FRANCISCO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Balanz | WM: EMPLEADOS', 'perdido', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1145338', 'cerrada'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LANUSSE LUCAS', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Roberto | Arancel: WM 3 | Fecha alta: 2025-03-05 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1323740', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1323740', 13968.52, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CARLINO JUAN MARIA', 'fisica', 'carlinojuan@gmail.com', '5491156975373', 'CABA', 'SAN FERNANDO', NULL, NULL, NULL, NULL, 'Categoria: 3 | Afinidad: Amistad | Canal ingreso: Roberto | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-06-17 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1416964', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1416964', 12156.4, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'HERNANDEZ ROCIO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Como llego: Referido | Arancel: WM 3 | Fecha alta: 2025-07-11 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1430813', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1430813', 13551.47, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'URCOLA ISRAEL', 'fisica', NULL, '5492994093224', NULL, NULL, NULL, 'Tecnico', NULL, NULL, 'Categoria: 4 | Cargo: Tecnico | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 2 | Fecha alta: 2025-07-11 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1430978', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CORVALAN OMAECHEVARRIA MAXIMO NICOLAS', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-07-11 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1431282', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1431282', 4544.18, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CARUSO JAVIER DOMINGO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-07-17 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1434527', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1434527', 6.83, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'HARITCHET CIARFAGLIA JUAN CRUZ', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-07-18 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1435025', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1435025', 201.04, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'VUOTTO MARTIN', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-07-22 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1437229', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1437229', 1204.94, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'PATRICIA ALEJANDRA MEDINA', 'fisica', NULL, '+54 9 11 5823-3763', 'CABA', NULL, NULL, 'Medico', NULL, NULL, 'Categoria: 4 | Cargo: Medico | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-07-28 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1440989', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'EATON GONZALO', 'fisica', NULL, '5491130504121', 'CABA', NULL, NULL, 'Ingeniero Informatico', NULL, NULL, 'Categoria: 2 | Cargo: Ingeniero Informatico | Canal ingreso: Balanz | WM: WM3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-08-01 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1444593', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1444593', 58124.71, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MAIDANA ADRIAN ALBERTO Y/O RUIZ FREYRE AIDA NOEMÍ', 'fisica', NULL, '5491158804937', 'CABA', NULL, NULL, 'Empresario chico', NULL, NULL, 'Categoria: 4 | Cargo: Empresario chico | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 2 | Fecha alta: 2025-08-01 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1444780', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LUNA FERNANDO OMAR Y/O RENNIS LAURA GRISELDA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 2 | Fecha alta: 2025-08-04 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1446041', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1446041', 2958.18, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'WERNER SILVANI BEATRIZ', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-08-07 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1448502', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ELEFTERIU MENDEZ ARGUIRO', 'fisica', 'balanz.enclosure625@passmail.com', '5491158040305', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-08-08 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1449453', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1449453', 925.28, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CALLETI SOFIA MARIA', 'fisica', 'soficaletti22@gmail.com', '5491150020163', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 2 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 2 | Fecha alta: 2025-08-14 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1452694', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1452694', 960.63, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'AVCHARIAN LUCAS ROBERTO DIKRAN', 'fisica', 'avcharianroberto@gmail.com', '5491176001705', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Afinidad: Familia | Canal ingreso: Roberto | WM: EMPLEADOS | Como llego: Referido Unidad | Arancel: EMPLEADOS | Fecha alta: 2025-08-14 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1452769', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1452769', 22856.1, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'HILEMAN RIVERA MARIA CLAUDIA Y/O GIFUNI CLAUDIO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-08-18 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1453962', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1453962', 32621.34, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'BONNET DUPEYRON AUBIN FRANCOIS', 'fisica', 'ccsinge@gmail.com', '5491131786795', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 2 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 2 | Fecha alta: 2025-08-19 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1455600', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1455600', 9373.4, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GIFUNI HILEMAN MARIA VALENTINA Y/O CARLINO TOMAS', 'fisica', NULL, NULL, 'CABA', 'BECCAR', NULL, NULL, NULL, NULL, 'Categoria: 3 | Afinidad: Familia | Canal ingreso: Roberto | WM: EMPLEADOS | Como llego: Referido Unidad | Arancel: EMPLEADOS | Fecha alta: 2025-08-20 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1456498', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1456498', 45161.61, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ACOSTA MARCELO ALBERTO', 'fisica', 'marcelo_acosta@hotmail.com', '5492994137347', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 2 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 2 | Fecha alta: 2025-08-21 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1457330', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GONZALEZ SANTIAGO ADOLFO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | WM: WM 2 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 2 | Fecha alta: 2025-08-21 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1457675', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1457675', 20249.09, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'FUNES JUAN ARISTIDES Y/O FUNES JOAQUIN EMANUEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-08-25 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1459159', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1459159', 26306.3, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'WIDEL GUILLERMO ELISEO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | WM: WM 4 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 4 | Fecha alta: 2025-08-26 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1460405', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1460405', 23612.43, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GANDOLA GUILLERMINA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 2 | Como llego: Referido Unidad | Arancel: WM 2 | Fecha alta: 2025-08-27 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1461011', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1461011', 301.63, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SANCHEZ MARTIN EMMANUEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-09-04 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1465461', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CASTRO NEVARES ANDRES JOSE', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-09-04 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1465530', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1465530', 5.85, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CARRILLO DIANA VIRGINIA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-09-05 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1466236', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'RAJCHENBERG NATAN ARIEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | WM: WM 4 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 4 | Fecha alta: 2025-09-09 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1468546', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1468546', 12831.43, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SIED LUCIA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-09-10 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1469515', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CAMINETSKY ALAN ARIEL', 'fisica', 'alancami__@hotmail.com', '5491161212183', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-09-23 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1476614', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SICARDI SANTIAGO ALEJANDRO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-09-29 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1480043', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ZAGORDA DEBORA SOLEDAD', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-06 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1484913', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1484913', 30805.05, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GIBOUDOT EDGARDO RAUL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-20 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1496266', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1496266', 697.47, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'DOBAL SAMANTA ALEJANDRA', 'fisica', 'samanta.alejandra.dobal@gmail.com', '5491260148401', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-20 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1496693', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SALVO MARINA SOLEDAD', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-10-21 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1497748', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1497748', 6.22, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'HABIB TOMAS JOSE', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-10-22 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1498856', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1498856', 13110.19, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'DASILVA GUSTAVO JAVIER', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-23 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1499491', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ARANGUREN IVAN', 'fisica', 'arangurenivan8@gmail.com', '5491136458736', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Afinidad: Amistad | Canal ingreso: Roberto | WM: WM 3 | Comentario: Tiene guita | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-10-23 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1499556', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'NOGUES PEÑA SOL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: ACUERDO Grupo Bimbo | Segmentacion: 5 | Como llego: Segmentación | Arancel: ACUERDO Grupo Bimbo 1 | Fecha alta: 2025-10-23 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1499637', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LAYES ADRIAN RAUL', 'fisica', NULL, NULL, 'CABA', 'TIGRE', NULL, 'Ingeniero Naval', NULL, NULL, 'Categoria: 2 | Cargo: Ingeniero Naval | Canal ingreso: Balanz | WM: WM 3 | Comentario: Dice que tiene para mandar 200 300k | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-23 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1499775', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1499775', 10797.78, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SHILTON TOMAS', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-27 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1501774', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1501774', 1836.01, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GALANTE LUCAS FEDERICO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-27 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1502039', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1502039', 13138.29, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GONZALEZ RODRIGO GERMAN', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-10-28 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1503855', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ALASIA HORACIO RAUL', 'fisica', 'halasia@icloud.com', '5491164852777', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-11-03 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1507400', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1507400', 35826.75, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MIRA ESTEBAN PABLO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-11-04 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1508652', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1508652', 5274.34, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'BOTELLI JUAN DE DIOS', 'fisica', 'juanbotelli21@hotmail.com', '5491162197602', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-11-05 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1510202', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'COLOMBO MATIAS ARIEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-11-07 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1511378', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1511378', 15564.4, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CANGIANO GUADALUPE ABRIL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: ACUERDO YPF | Segmentacion: 5 | Como llego: Campaña + Segmentación | Arancel: ACUERDO YPF | Fecha alta: 2025-11-12 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1513784', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1513784', 8985.15, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SANCHEZ CASTRO TOMAS', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: ACUERDO Get Sales Done | Como llego: Referido Unidad | Arancel: ACUERDO Get Sales Done | Fecha alta: 2025-11-14 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1515423', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ALONSO ENRIQUE ARTURO', 'fisica', 'ealonso3@gmail.com', '5493513902788', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-11-17 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1515863', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SUAREZ MARTINIANO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: ACUERDO Get Sales Done | Como llego: Referido Unidad | Arancel: ACUERDO Get Sales Done | Fecha alta: 2025-11-18 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1517798', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ARREONDO ALMA DANIELA', 'fisica', 'alma.arreondo@weunlocksales.com', '5495422418277', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: ACUERDO Get Sales Done | Como llego: Referido Unidad | Arancel: ACUERDO Get Sales Done | Fecha alta: 2025-11-18 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1517806', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CARDAHI MARTINA', 'fisica', 'cardahimartina@gmail.com', '5491140495582', 'CABA', 'PILAR', NULL, NULL, NULL, NULL, 'Categoria: 2 | Afinidad: Amistad | Canal ingreso: Roberto | WM: WM 3 | Como llego: Reasignación | Arancel: WM 3 | Fecha alta: 2025-11-20 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1519166', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1519166', 30219.02, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'IRIBARREN JUAN MARTIN', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-11-20 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1519253', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SZULDMAN ALEJANDRO GABRIEL Y/O FAKS MIRIAM RUTH', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-11-25 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1520330', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GIFUNI HILEMAN FRANCISCO Y/O CACERES MARIA CAROLINA', 'fisica', NULL, NULL, 'CABA', 'CENTOR', NULL, NULL, NULL, NULL, 'Categoria: 2 | Afinidad: Familia | Canal ingreso: Roberto | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2025-12-02 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1524715', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1524715', 53970.55, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MASTROBERTI MARIANA LAURA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2025-12-09 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1528899', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'TAUS GASTON FEDERICO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-01-02 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1541121', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ORZUSA VILMA ELISA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-01-12 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1550411', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'OBEID GABRIEL ALEJANDRO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-01-15 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1553915', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1553915', 403.2, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SZOCS FRANCO LADISLAO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-01-19 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1557573', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1557573', 17924.95, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'PAGANUCCI DIEGO  MIGUEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-04 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1572347', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CAIA ZOTES MARIA PAULA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-05 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1572550', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'PATANE ANDREA VANINA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-05 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1572873', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'HANSEN MARIA FLORENCIA', 'fisica', NULL, '+54 9 11 6191-7241', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-06 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1574562', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1574562', 4174.92, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'BRUNI ANTONELLA', 'fisica', NULL, '+54 9 11 3581-3581', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-09 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1575794', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1575794', 2564.08, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'PAZ SOL NATASHA', 'fisica', 'sol.n.paz@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Roberto | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2026-02-09 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1576441', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'JUAN IGNACIO BAIGORRIA', 'fisica', 'nachobaigorria.02@gmail.com', NULL, 'CABA', NULL, NULL, 'Empleado', NULL, NULL, 'Categoria: 4 | Cargo: Empleado | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-19 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1583626', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1583626', 1767.58, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'JUAN AGUSTIN NASELLO', 'fisica', 'drnasello@gmail.com', NULL, NULL, NULL, NULL, 'Doctor plastico', NULL, NULL, 'Categoria: 2 | Cargo: Doctor plastico | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-20 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1584957', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MARIA BELEN POZZI', 'fisica', 'bpozzi80@gmail.com', NULL, 'MENDOZA', NULL, NULL, 'Sommelier', NULL, NULL, 'Categoria: 4 | Cargo: Sommelier | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-23 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1585930', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1585930', 5247.89, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'PABLO JOSE CAEIRO', 'fisica', 'caeiropablo61@gmail.com', NULL, 'CABA', 'Pacheco GOLF', NULL, 'Empresario', NULL, NULL, 'Categoria: 1 | Cargo: Empresario | Canal ingreso: Balanz | WM: WM 3 | Comentario: TIENE PERSHING EN INVIU | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-24 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1587224', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'BOODER DANIELA MARIBEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-24 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1587261', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ORLANDI ANDREA SOLEDAD', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-26 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1589210', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MARCOS ESTEBAN GARCIA', 'fisica', 'gmarcosesteban80@gmail.com', '+54 9 2494 64-5019', 'CABA', NULL, NULL, 'Empleado Publico', NULL, NULL, 'Categoria: 4 | Cargo: Empleado Publico | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 1 | Fecha alta: 2026-02-26 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1589462', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1589462', 68.43, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SUEIRO RODRIGO JOSÉ', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-02-27 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1590131', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ORTIZ PATRICIA ELIZABETH Y/O FUNES JOAQUIN EMANUEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2026-03-03 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1592042', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1592042', 689.09, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'RODRIGO CLOSA', 'fisica', 'rodrigo.closa@gmail.com', NULL, 'CABA', NULL, NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-03-10 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1597479', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1597479', 35059.4, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SERENA LANUSSE', 'fisica', 'serenalanusse@gmail.com', NULL, 'CABA', 'TIGRE', NULL, NULL, NULL, NULL, 'Categoria: 3 | Canal ingreso: Balanz | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-03-18 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1602317', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1602317', 3734.36, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LUCIANO ROMAN FERNANDEZ LEON', 'fisica', NULL, '+54 9 11 2292-6815', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 1 | Canal ingreso: Balanz | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-03-19 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1603334', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1603334', 259162.2, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ANDY WALDO PONCE LEON', 'fisica', 'andy.ponce@ypf.com', NULL, 'CABA', NULL, NULL, 'Funcionario YPF', NULL, NULL, 'Categoria: 3 | Cargo: Funcionario YPF | Canal ingreso: Balanz | WM: WM 4 | Segmentacion: 5 | Como llego: Campaña + Segmentación | Arancel: WM 4 | Fecha alta: 2026-03-20 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1603557', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'FATIMA CATALANO', 'fisica', 'fatimacatalanoo@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-03-26 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1606204', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1606204', 2054.24, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'DOMINGUEZ FRANCO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-03-27 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1606930', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1606930', 1.22, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ARCE CARLOS MARTIN', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-03-31 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1609397', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1609397', 2196.62, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MARTINEZ JOAQUIN AGUSTIN', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-04-06 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1612237', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ORTIZ MARIA FLORENCIA Y/O GALANTE LUCAS FEDERICO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Roberto | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2026-04-13 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1617074', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1617074', 16843.97, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'TORRES FLORES ALEJANDRO ANTONIO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-04-13 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1617169', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1617169', 21153.29, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LEANZA ARIEL LUJAN', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 1 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-04-13 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1617303', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1617303', 67280.98, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'BARISONE JORGE GABRIEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-04-20 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1621650', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SAFDIE RAFAEL EDUARDO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-04-21 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1622231', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1622231', 8950.8, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'OBIGLIO MARIANA INES', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1626840', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GET SALES DONE SA', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Afinidad: Familia | Canal ingreso: Roberto | WM: WM 3 | Como llego: Reasignación | Arancel: WM 3 | Fecha alta: 2025-10-29 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '162710', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GARCIA MACARENA MARIEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-04-29 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1627777', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MACEDO ANTONIO EMILIO Y/O HILEMAN MARIA MARCELA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Como llego: Reasignación | Arancel: WM 3 | Fecha alta: 2026-04-29 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1627921', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1627921', 3210.55, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'BOTELLA MARCOS DANIEL Y/O VALVERDE MARIA FLORENCIA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-04-30 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1628361', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LOSIO LAUTARO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-05-11 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1634884', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1634884', 2243.31, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'BELGRANO CLARA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-05-15 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1638577', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'DOMINGO MARIA SOLEDAD', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-05-18 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1639100', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GAMBERONI ALICIA BEATRIZ Y/O MAIDANA ADRIAN ALBERTO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2026-05-19 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1640471', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1640471', 1428.66, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'YOMAYEL LUCAS JOSE', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-05-19 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1640735', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'OCHOA DELFINA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Como llego: Reasignación | Arancel: WM 3 | Fecha alta: 2026-06-02 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1649628', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '1649628', 7892.2, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ALDERETE MATIAS LEONARDO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2026-06-08 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1653256', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LIERN BAYON ROMEO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2026-06-11 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '1657671', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'AVCHARIAN KEHYAIAN ROBERTO DIKRAN', 'fisica', 'aguamardeportes@gmail.com', '+598 91 687 616', 'URUGUAY', NULL, NULL, 'Empresario', NULL, NULL, 'Categoria: 1 | Afinidad: Familia | Cargo: Empresario | Canal ingreso: Roberto | WM: WM 3 | Como llego: Reasignación | Arancel: Diferenciado | Fecha alta: 2025-07-10 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '19150', 'activa'::cuenta_estado, 'bci'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '19150', 164897.97, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MACEDO HILEMAN ANTONIO EMILIO', 'fisica', NULL, '5491132473540', 'CABA', 'PILAR', NULL, 'Empresario', NULL, NULL, 'Categoria: 1 | Afinidad: Familia | Cargo: Empresario | Canal ingreso: Roberto | WM: ACUERDO Get Sales Done | Segmentacion: 1 | Como llego: Segmentación Reasignada | Arancel: ACUERDO Get Sales Done | Fecha alta: 2019-09-17 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '285119', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '285119', 80129.1, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SILBERG CAMILA NOEL', 'fisica', NULL, NULL, 'CABA', NULL, NULL, 'Abogada', NULL, NULL, 'Categoria: 4 | Afinidad: Amistad | Cargo: Abogada | Canal ingreso: Roberto | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2020-04-20 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '321944', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '321944', 3347.25, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ANTON AGUILAR JUAN CRUZ', 'fisica', 'antonaguilarjc@gmail.com', '5491140874244', NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Afinidad: Amistad | Canal ingreso: Roberto | WM: ACUERDO Get Sales Done | Comentario: Tiene pershing | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: ACUERDO Get Sales Done | Fecha alta: 2020-12-03 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '361638', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '361638', 18470.49, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GIFUNI HILEMAN MARIA VALENTINA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2021-05-05 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '385278', 'activa'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'LUSTAU DIEGO OMAR', 'fisica', 'diegolustau@hotmail.com', '5492215778865', NULL, NULL, NULL, 'Tesorero Supervielle', NULL, NULL, 'Categoria: 4 | Cargo: Tesorero Supervielle | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2021-11-12 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '420085', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MAIDANA MARCOS', 'fisica', 'marcosmaidana1998@gmail.com', '5493875367316', NULL, NULL, NULL, 'Estudiante', NULL, NULL, 'Categoria: 4 | Cargo: Estudiante | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2021-11-16 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '420762', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '420762', 1.3, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MICUCCI GUSTAVO EZEQUIEL', 'fisica', 'micuccigustavo@hotmail.com', '5493487523367', NULL, NULL, NULL, 'Empleado Mantenimiento', NULL, NULL, 'Categoria: 4 | Cargo: Empleado Mantenimiento | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2021-11-16 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '420928', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '420928', 1.1, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MANDO DIEGO', 'fisica', 'diegomando93@gmail.com', '5493583851261', NULL, NULL, NULL, 'Profesional Independiente Agronomo', NULL, NULL, 'Categoria: 4 | Cargo: Profesional Independiente Agronomo | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2021-11-30 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '422811', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SALVO AZURI PABLO ANDRES', 'fisica', 'psalvo@hotmail.com.ar', '5492644115309', NULL, NULL, NULL, 'Ingeniero Electrico', NULL, NULL, 'Categoria: 4 | Cargo: Ingeniero Electrico | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2021-12-03 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '423358', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SANCHEZ ROMELIA PAULA', 'fisica', 'juan_mgp21@hotmail.com', '5493794826341', NULL, NULL, NULL, 'Jubilada', NULL, NULL, 'Categoria: 4 | Cargo: Jubilada | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2021-12-07 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '423760', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SANCHEZ EDUARDO SANTIAGO', 'fisica', 'e.s_sanchez@hotmail.com', '5491161952433', NULL, NULL, NULL, 'Jefe de departamento en Ceamse', NULL, NULL, 'Categoria: 4 | Cargo: Jefe de departamento en Ceamse | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2021-12-20 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '425221', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'FABRIZIO ANDREA LEONOR', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 1 | Canal ingreso: Roberto | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: EXE 1 | Fecha alta: 2021-12-20 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '425298', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '425298', 125028.88, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SABAROTZ MARTIN EDGARDO', 'fisica', 'msabarotz@hotmail.com', '5493487656669', NULL, NULL, NULL, 'Especialista Electrónico Mantenimiento IC', NULL, NULL, 'Categoria: 4 | Cargo: Especialista Electrónico Mantenimiento IC | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2021-12-28 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '426098', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '426098', 3.93, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MONTES MARIA VICTORIA .', 'fisica', 'mv.montesfagalde@gmail.com', '5493454055260', NULL, NULL, NULL, 'Abogada Asociada Junior', NULL, NULL, 'Categoria: 4 | Cargo: Abogada Asociada Junior | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2021-12-29 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '426306', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '426306', 0.04, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'DELGADO HUGO EMILIO', 'fisica', 'hugoemilio@yahoo.com', '5492235596372', NULL, NULL, NULL, 'Medico', NULL, NULL, 'Categoria: 4 | Cargo: Medico | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2022-01-03 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '426517', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '426517', 179.5, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'PIETROBELLI MARIA VICTORIA', 'fisica', 'mvpietrobelli@gmail.com', '5491150351245', NULL, NULL, NULL, 'Escribiente Auxiliar en Poder Judicial de la Nación.', NULL, NULL, 'Categoria: 4 | Cargo: Escribiente Auxiliar en Poder Judicial de la Nación. | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido | Arancel: WM 3 | Fecha alta: 2022-01-07 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '427384', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '427384', 275.01, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'NORRIS DILLON MATIAS GERARDO', 'fisica', 'matiasnorrisdillon@gmail.com', '5491154813582', NULL, NULL, NULL, 'Comerciante por mayor y menor', NULL, NULL, 'Categoria: 4 | Cargo: Comerciante por mayor y menor | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2022-01-10 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '427673', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '427673', 448.16, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GOMEZ MANUEL ROBERTO', 'fisica', 'juan_mgp21@hotmail.com', '5493794826341', NULL, NULL, NULL, 'Jubilado', NULL, NULL, 'Categoria: 4 | Cargo: Jubilado | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2022-01-11 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '427804', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '427804', 0.93, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'INCATASCIATO ARIEL FERNANDO', 'fisica', 'arielinca@gmail.com', '5493516195870', NULL, NULL, NULL, 'Analista de sistemas', NULL, NULL, 'Categoria: 4 | Cargo: Analista de sistemas | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2022-01-21 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '429277', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CANZANI SANTIAGO PEDRO', 'fisica', 'santiago@canzani.net', '5491154043906', NULL, NULL, NULL, 'Director los Azhares', NULL, NULL, 'Categoria: 4 | Cargo: Director los Azhares | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Balanz | Arancel: WM 4 | Fecha alta: 2022-01-25 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '429864', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '429864', 1.19, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'PRATO MUJICA JAIRO LUIS', 'fisica', 'jilpim@gmail.com', '5491127185651', NULL, NULL, NULL, 'Fisico Medico', NULL, NULL, 'Categoria: 4 | Cargo: Fisico Medico | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2022-01-26 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '429943', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ELSESSER LEANDRO OSCAR', 'fisica', 'leandroelsesser@hotmail.com', '5493364621531', NULL, NULL, NULL, 'comerciante', NULL, NULL, 'Categoria: 4 | Cargo: comerciante | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2022-01-27 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '430105', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '430105', 0.47, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MULET PAULA ANDREA', 'fisica', 'paau.mulet@hotmail.com', '5491134563701', NULL, NULL, NULL, 'Empleada de la Salud SIEMENS', NULL, NULL, 'Categoria: 4 | Cargo: Empleada de la Salud SIEMENS | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 5 | Como llego: Segmentación | Arancel: WM 3 | Fecha alta: 2022-01-31 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '430583', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GUZZONATO JUAN ISAAC', 'fisica', 'mariaconstanzaguzzonato@gmail.com', '5493425946466', NULL, NULL, NULL, 'Jubilado', NULL, NULL, 'Categoria: 4 | Cargo: Jubilado | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2022-02-01 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '430867', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GREPPI ALEJANDRO', 'fisica', 'alejandro.greppi@gmail.com', '5491162670901', NULL, NULL, NULL, 'Test Lead en Inworx/Charles Taylor.', NULL, NULL, 'Categoria: 4 | Cargo: Test Lead en Inworx/Charles Taylor. | Canal ingreso: Balanz | WM: WM 3 | Como llego: Referido Unidad | Arancel: WM 3 | Fecha alta: 2022-02-02 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '431101', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '431101', 4.3, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CRUZ CARLOS LEONARDO NOÉ', 'fisica', 'carlos123cln7@gmail.com', '5493884130182', NULL, NULL, NULL, 'Enseñanza', NULL, NULL, 'Categoria: 4 | Cargo: Enseñanza | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2022-02-03 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '431148', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'CONTENTI FRANCISCO PABLO', 'fisica', 'quitocontenti@hotmail.com', '5491150463824', NULL, NULL, NULL, 'Fiduciario/intermed./adm. Fideicomiso', NULL, NULL, 'Categoria: 4 | Cargo: Fiduciario/intermed./adm. Fideicomiso | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2022-02-07 00:00:00 | ALERTA: Requiere actividad', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '431805', 'inactiva'::cuenta_estado, 'local'::plaza_tipo);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'SANTOS MENDIOLA GONZALO DANIEL', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 2 | Canal ingreso: Balanz | WM: WM 3 | Como llego: Reasignación | Arancel: WM 3 | Fecha alta: 2022-06-29 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '454378', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '454378', 24153.24, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'ESPADA MARIANO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2022-12-02 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '481060', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '481060', 3695.97, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GIFUNI HILEMAN MARIA JOSEFINA', 'fisica', NULL, '+54 9 11 2176-0517', 'CABA', 'OLIVOS', NULL, NULL, NULL, NULL, 'Categoria: 2 | Afinidad: Familia | Canal ingreso: Roberto | WM: WM3 | Como llego: Reasignación | Arancel: Diferenciado | Fecha alta: 2025-10-09 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '5000005', 'activa'::cuenta_estado, 'bci'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '5000005', 230.69, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'OCHOA DELFINA', 'fisica', 'delfiochoa33@gmail.com', '+54 9 11 4075-4144', 'CABA', NULL, NULL, 'Psicologa', NULL, NULL, 'Categoria: 2 | Cargo: Psicologa | Canal ingreso: Roberto | WM: Bullk | Como llego: Referido Unidad | Arancel: Diferenciado | Fecha alta: 2026-03-10 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '5000951', 'activa'::cuenta_estado, 'bci'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '5000951', 32004.59, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'MACEDO HILEMAN ANTONIO EMILIO', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Como llego: Reasignación | Arancel: Diferenciado | Fecha alta: 2026-05-19 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '5001315', 'activa'::cuenta_estado, 'bci'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '5001315', 33041.35, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'GIFUNI HILEMAN MARIA JOSEFINA', 'fisica', NULL, '+54 9 11 2176-0517', 'CABA', 'OLIVOS', NULL, 'Jefatura', NULL, NULL, 'Categoria: 2 | Afinidad: Familia | Cargo: Jefatura | Canal ingreso: Roberto | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2023-03-28 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '512924', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '512924', 71740.37, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'FORCONI MARIA FLORENCIA', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2023-03-30 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '513777', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '513777', 6.37, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_provincia, domicilio_ciudad, razon_social, profesion, actividad_declarada, referenciado_por, notas, estado, potencial_usd)
  values (v_owner, 'cliente', 'DE LA VEGA FELIPE', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Categoria: 4 | Canal ingreso: Balanz | WM: WM 3 | Segmentacion: 4 | Como llego: Segmentación Reasignada | Arancel: WM 3 | Fecha alta: 2023-05-23 00:00:00', 'activo', 0)
  returning id into v_cliente_id;
  insert into public.cuentas (cliente_id, numero_cuenta, estado_cuenta, plaza)
  values (v_cliente_id, '548295', 'activa'::cuenta_estado, 'local'::plaza_tipo);
  insert into public.patrimonio (fecha_carga, numero_cuenta, aum, cash)
  values (current_date, '548295', 0.91, 0);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Newland Construcciones', 'juridica', NULL, NULL, NULL, NULL, 'Newland', NULL, NULL, NULL, '2026-12-02', 'Prioridad: ALTA | Sector: Desarrolladora | Producto de interes: BCV | 1er contacto: 1/31/2026', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Maximiliano Rodriguez Irachar', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA', 'activo', 0, true);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Alvaro Busso', 'fisica', NULL, NULL, 'Argentina', NULL, NULL, 'Jugador', 'Mathias AFTER 90', NULL, NULL, 'Prioridad: MEDIA | Red de contactos: Futbolistas | Sector: Futbol | Producto de interes: BCV', 'activo', 0, true);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Santiago Gonzalez', 'fisica', NULL, NULL, 'Uruguay', NULL, NULL, 'Lic. Ed Fisica', NULL, NULL, NULL, 'Prioridad: BAJA | Afinidad: Amistad | Sector: Salud y Deporte | Producto de interes: BCI | 1er contacto: 2025-07-07 00:00:00', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Urbano Express', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA | Afinidad: Familia | 1er contacto: 2025-06-08 00:00:00', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Alejandro Hernan Gomez', 'fisica', NULL, '+54 9 11 5756-1982', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: BAJA | Comentario: No contesta | 1er contacto: 7/28/2025', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Erika Guani', 'fisica', NULL, NULL, 'Uruguay', NULL, NULL, 'Economista', NULL, NULL, NULL, 'Prioridad: BAJA | Afinidad: Amistad | Sector: Banca | Producto de interes: BCI', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Felipe Borteiro', 'fisica', NULL, NULL, 'Uruguay', NULL, NULL, 'Contador', NULL, NULL, NULL, 'Prioridad: BAJA | Afinidad: Amistad | Producto de interes: BCI | 1er contacto: 2025-07-07 00:00:00', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Garo Keyhaian', 'fisica', NULL, NULL, 'Uruguay', NULL, NULL, 'Jubilado', NULL, NULL, '2025-07-07', 'Prioridad: BAJA | Afinidad: Familia | Producto de interes: BCI | Comentario: Tiene colocado todo en acciones, esta abajo perdiendo, quiere esperar un poco para salir de donde esta. El me contacta cuando pueda, Mandar Msj en Octubre | 1er contacto: 2025-07-07 00:00:00', 'perdido', 500000, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Horacio Bardanca', 'fisica', NULL, NULL, 'Mundial', NULL, NULL, 'Contratista de Futbolistas', NULL, NULL, NULL, 'Prioridad: BAJA | Afinidad: Amistad | Sector: Salud y Deporte | Producto de interes: BCI | 1er contacto: 7/22/2025', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Lorenzo Coelho', 'fisica', NULL, NULL, 'Uruguay', NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: BAJA | Afinidad: Amistad | 1er contacto: 2025-07-07 00:00:00', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Marcelo Simonian (Dodici)', 'fisica', NULL, '+54 9 11 6721-4331', 'Argentina', NULL, NULL, NULL, NULL, NULL, '2025-05-08', 'Prioridad: BAJA | Afinidad: Amistad | Comentario: Lo tiene ceballos, a el y todas sus empresas | 1er contacto: 2025-01-08 00:00:00', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'cliente', 'Get Sales Done', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA | Afinidad: Familia | Sector: Ventas | 1er contacto: 2025-06-08 00:00:00', 'activo', 50000, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'cliente', 'Delfina Ochoa', 'fisica', NULL, '+54 9 11 4075-4144', 'Argentina', 'CABA', NULL, NULL, 'ANTON JUAN', NULL, NULL, 'Prioridad: MEDIA | Comentario: Tiene cuenta en ikb | 1er contacto: 2025-01-11 00:00:00', 'activo', 30000, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Permoda Global Sports', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA | 1er contacto: 2026-11-02 00:00:00', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Centro Argentino de Ingenieros', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA', 'activo', 0, true);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'After 90 Juridica', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, 'Mathias AFTER 90', NULL, NULL, 'Prioridad: MEDIA', 'activo', 0, true);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Nicolas Pstyga', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: MEDIA | Comentario: Es un panflin | 1er contacto: 2025-01-11 00:00:00', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Jagermaister Argentina', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Fernando Muslera', 'fisica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'FMS Papo', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: ALTA', 'perdido', 0, false);

  insert into public.clientes (owner_id, tipo, nombre, tipo_persona, email, telefono, domicilio_pais, domicilio_ciudad, razon_social, profesion, referenciado_por, fecha_nacimiento, fecha_ultimo_contacto, notas, estado, potencial_usd, prospecto_trabajando)
  values (v_owner, 'prospecto', 'Andreani', 'juridica', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prioridad: BAJA', 'perdido', 0, false);

end $$;

-- Verificación
select tipo, estado, count(*) from public.clientes group by tipo, estado order by tipo, estado;
select count(*) as cuentas_cargadas from public.cuentas;
select count(*) as patrimonio_cargado from public.patrimonio;