-- =========================================================
-- Corrige nombre/apellido y rol de los usuarios existentes
-- que quedaron en blanco.
-- Ojo: asumí el dominio @gmail.com para el segundo mail —
-- si no es así, corregilo antes de correr.
-- =========================================================

update public.usuarios
set nombre = 'Roberto', apellido = 'Avcharian', rol = 'admin'
where email = 'avcharian1999@gmail.com';

update public.usuarios
set nombre = 'Roberto', apellido = 'Avcharian', rol = 'fa'
where email = 'avcharianrobertom@gmail.com';

-- Verificación
select nombre, apellido, email, rol from public.usuarios
where email in ('avcharian1999@gmail.com', 'avcharianrobertom@gmail.com');
