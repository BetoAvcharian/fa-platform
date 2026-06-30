-- =========================================================
-- PASO 1: DIAGNÓSTICO — ver cuántas cuentas tienen más de
-- una fila para la misma fecha de cierre (esto es lo que
-- infla los totales). Se espera "duplicados" en 0 si todo
-- estuviera bien.
-- =========================================================
select
  fecha_carga,
  count(*) as filas_totales,
  count(distinct numero_cuenta) as cuentas_unicas,
  count(*) - count(distinct numero_cuenta) as filas_duplicadas_de_mas
from public.patrimonio
group by fecha_carga
order by fecha_carga;
