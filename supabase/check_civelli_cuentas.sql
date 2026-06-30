select ct.cliente_id, c.nombre, cu.numero_cuenta, cu.id as cuenta_id, ct.rol_titular
from public.cuenta_titulares ct
join public.cuentas cu on cu.id = ct.cuenta_id
join public.clientes c on c.id = ct.cliente_id
where ct.cliente_id in (
  'a3ffc442-0095-4f61-bfb1-80e82755f7e8',  -- Civelli Tomas
  'b6a391da-fcc4-463d-a4b5-64bd3f81a85c'   -- Civelli Timoteo
)
order by cu.numero_cuenta;
