-- =========================================================
-- Reorganización de usuarios:
-- 1) Crea admin@titcrm.com (contraseña Admin1234) como Admin
-- 2) Te pasa a vos (avcharian1999@gmail.com) a Manager
-- 3) Borra TODOS los demás usuarios (los de prueba)
-- =========================================================

-- 1) Crear el nuevo admin
do $$
declare
  v_admin_id uuid;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated',
    'admin@titcrm.com', crypt('Admin1234', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"nombre":"Admin","apellido":"TIT CRM"}',
    now(), now(), '', '', '', ''
  ) returning id into v_admin_id;

  -- esperar al trigger que crea la fila en public.usuarios, y pasarlo a admin
  perform pg_sleep(0.3);
  update public.usuarios set rol = 'admin' where id = v_admin_id;
end $$;

-- 2) Pasarte a Manager
update public.usuarios set rol = 'manager' where email = 'avcharian1999@gmail.com';

-- 3) Borrar todos los demás usuarios (queda solo el tuyo y el admin nuevo)
delete from auth.users
where email not in ('avcharian1999@gmail.com', 'admin@titcrm.com');

-- Verificación
select nombre, apellido, email, rol from public.usuarios order by rol;
