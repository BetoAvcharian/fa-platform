-- =========================================================
-- USUARIOS DE TESTING — crea 1 Manager + 3 FAs ya asignados
-- a ese Manager (un equipo armado, listo para probar).
--
-- Contraseña para TODOS: Test1234!
-- Mails: manager.test@titcrm.com, fa1.test@titcrm.com,
--        fa2.test@titcrm.com, fa3.test@titcrm.com
--
-- Correr en el SQL Editor de Supabase.
-- =========================================================

do $$
declare
  v_manager_id uuid;
  v_fa1_id uuid;
  v_fa2_id uuid;
  v_fa3_id uuid;
begin
  -- Manager
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated',
    'manager.test@titcrm.com', crypt('Test1234!', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"nombre":"Martina","apellido":"Manager"}',
    now(), now(), '', '', '', ''
  ) returning id into v_manager_id;

  -- FA 1
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated',
    'fa1.test@titcrm.com', crypt('Test1234!', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"nombre":"Lucas","apellido":"FA Uno"}',
    now(), now(), '', '', '', ''
  ) returning id into v_fa1_id;

  -- FA 2
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated',
    'fa2.test@titcrm.com', crypt('Test1234!', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"nombre":"Sofía","apellido":"FA Dos"}',
    now(), now(), '', '', '', ''
  ) returning id into v_fa2_id;

  -- FA 3
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated',
    'fa3.test@titcrm.com', crypt('Test1234!', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"nombre":"Ezequiel","apellido":"FA Tres"}',
    now(), now(), '', '', '', ''
  ) returning id into v_fa3_id;

  -- Esperar un instante a que el trigger cree las filas en public.usuarios
  perform pg_sleep(0.5);

  -- Asignar roles y equipo
  update public.usuarios set rol = 'manager' where id = v_manager_id;
  update public.usuarios set rol = 'fa', manager_id = v_manager_id where id in (v_fa1_id, v_fa2_id, v_fa3_id);
end $$;

-- Verificación
select nombre, apellido, email, rol, manager_id from public.usuarios
where email like '%test@titcrm.com'
order by rol desc, nombre;
