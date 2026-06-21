select periodo_mes, periodo_anio, count(*) as operaciones, sum(monto) as total_usd
from public.comisiones
where periodo_anio = 2026
group by periodo_mes, periodo_anio
order by periodo_mes;
