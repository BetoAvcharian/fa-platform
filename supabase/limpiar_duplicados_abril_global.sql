-- =========================================================
-- LIMPIEZA — duplicados del 30/04/2026 (toda la base)
-- Deja una sola fila por cuenta para esa fecha (la más
-- antigua, por id) y borra el resto.
-- =========================================================

-- PASO 1 (opcional, para mirar antes): cuántas filas de sobra hay por cuenta
select numero_cuenta, count(*) as filas
from public.patrimonio
where fecha_carga = '2026-04-30'
group by numero_cuenta
having count(*) > 1
order by filas desc;

-- PASO 2: borrar los duplicados, dejando 1 por cuenta
with duplicados as (
  select
    id,
    row_number() over (
      partition by numero_cuenta
      order by id
    ) as fila
  from public.patrimonio
  where fecha_carga = '2026-04-30'
)
delete from public.patrimonio
where id in (select id from duplicados where fila > 1);

-- PASO 3: verificación — debería decir 0 filas_duplicadas_de_mas para esa fecha
select
  fecha_carga,
  count(*) as filas_totales,
  count(distinct numero_cuenta) as cuentas_unicas,
  count(*) - count(distinct numero_cuenta) as filas_duplicadas_de_mas
from public.patrimonio
where fecha_carga = '2026-04-30'
group by fecha_carga;
