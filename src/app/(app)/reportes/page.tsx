import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD } from "@/lib/utils";
import { ExportExcelButton } from "@/components/crm/export-excel-button";
import { ParetoChart } from "@/components/crm/pareto-chart";
import { TopComisionTable } from "@/components/crm/top-comision-table";

const MESES_NOMBRE = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function buildPareto(items: { nombre: string; valor: number }[]) {
  const ordenado = items.filter((i) => i.valor > 0).sort((a, b) => b.valor - a.valor);
  const total = ordenado.reduce((s, i) => s + i.valor, 0);
  let acumulado = 0;
  const conPct = ordenado.map((i) => {
    acumulado += i.valor;
    return { nombre: i.nombre, valor: i.valor, acumuladoPct: total > 0 ? (acumulado / total) * 100 : 0 };
  });
  return conPct.slice(0, 20);
}

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: usuario } = await supabase.from("usuarios").select("rol").eq("id", user?.id).single();

  const clientes = await fetchAllRows((from, to) => supabase.from("clientes").select("*").range(from, to));
  const cuentas = await fetchAllRows((from, to) => supabase.from("cuentas").select("*").range(from, to));
  const titulares = await fetchAllRows((from, to) => supabase.from("cuenta_titulares").select("*").range(from, to));
  const patrimonio = await fetchAllRows((from, to) =>
    supabase.from("patrimonio").select("*").order("fecha_carga", { ascending: false }).range(from, to)
  );
  const comisiones = await fetchAllRows((from, to) => supabase.from("comisiones").select("*").range(from, to));

  const cuentaPorId = new Map(cuentas.map((c) => [c.id, c]));

  const activos = clientes.filter((c) => c.tipo === "cliente" && c.estado === "activo");
  const prospectos = clientes.filter((c) => c.tipo === "prospecto" && c.estado !== "perdido");

  // AUM más reciente por número de cuenta
  const aumPorCuenta = new Map<string, number>();
  patrimonio.forEach((p) => {
    if (!aumPorCuenta.has(p.numero_cuenta)) aumPorCuenta.set(p.numero_cuenta, Number(p.aum));
  });

  // AUM por cliente — pasando por la tabla de titulares (una cuenta puede sumar a 2 clientes si es mancomunada)
  const aumPorCliente = new Map<string, number>();
  titulares.forEach((t) => {
    const cuenta = cuentaPorId.get(t.cuenta_id);
    if (!cuenta) return;
    const aum = aumPorCuenta.get(cuenta.numero_cuenta) ?? 0;
    aumPorCliente.set(t.cliente_id, (aumPorCliente.get(t.cliente_id) ?? 0) + aum);
  });

  const anioActual = new Date().getFullYear();
  const comisionesYTD = comisiones.filter((c) => c.periodo_anio === anioActual);

  const comisionPorCliente = new Map<string, number>();
  const comisionPorClientePorMes = new Map<string, Map<string, number>>(); // clienteId -> (mes -> total)
  comisionesYTD.forEach((com) => {
    if (!com.comitente) return;
    const cuenta = cuentas.find((cu) => cu.numero_cuenta === com.comitente);
    if (cuenta) {
      const titularesDeEstaCuenta = titulares.filter((t) => t.cuenta_id === cuenta.id);
      titularesDeEstaCuenta.forEach((t) => {
        comisionPorCliente.set(t.cliente_id, (comisionPorCliente.get(t.cliente_id) ?? 0) + Number(com.monto));
        const porMes = comisionPorClientePorMes.get(t.cliente_id) ?? new Map<string, number>();
        const mesLabel = MESES_NOMBRE[com.periodo_mes] ?? String(com.periodo_mes);
        porMes.set(mesLabel, (porMes.get(mesLabel) ?? 0) + Number(com.monto));
        comisionPorClientePorMes.set(t.cliente_id, porMes);
      });
    }
  });

  const topAum = [...clientes]
    .map((c) => ({ ...c, aum: aumPorCliente.get(c.id) ?? 0 }))
    .sort((a, b) => b.aum - a.aum)
    .slice(0, 10);

  const topComision = [...clientes]
    .map((c) => ({
      ...c,
      comision: comisionPorCliente.get(c.id) ?? 0,
      porMes: Array.from((comisionPorClientePorMes.get(c.id) ?? new Map()).entries()).map(([mes, total]) => ({ mes, total })),
    }))
    .filter((c) => c.comision > 0)
    .sort((a, b) => b.comision - a.comision)
    .slice(0, 10);

  // AUM Local vs Offshore (según plaza de cada cuenta) + Total
  let aumLocalTotal = 0;
  let aumOffshoreTotal = 0;
  cuentas.forEach((cuenta) => {
    const aum = aumPorCuenta.get(cuenta.numero_cuenta) ?? 0;
    if (cuenta.plaza === "local") aumLocalTotal += aum;
    else aumOffshoreTotal += aum;
  });
  const aumTotalGeneral = aumLocalTotal + aumOffshoreTotal;

  // Comisiones totalizadas por mes
  const comisionesPorMes = new Map<string, number>();
  comisiones.forEach((c) => {
    const key = `${c.periodo_anio}-${String(c.periodo_mes).padStart(2, "0")}`;
    comisionesPorMes.set(key, (comisionesPorMes.get(key) ?? 0) + Number(c.monto));
  });
  const comisionesPorMesArr = Array.from(comisionesPorMes.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => {
      const [anio, mes] = key.split("-");
      return { label: `${MESES_NOMBRE[Number(mes)]} ${anio}`, total };
    });

  // Pareto: clientes por AUM y por Comisión
  const paretoAum = buildPareto(
    clientes.map((c) => ({ nombre: `${c.nombre} ${c.apellido ?? ""}`.trim(), valor: aumPorCliente.get(c.id) ?? 0 }))
  );
  const paretoComision = buildPareto(
    clientes.map((c) => ({ nombre: `${c.nombre} ${c.apellido ?? ""}`.trim(), valor: comisionPorCliente.get(c.id) ?? 0 }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Reportes</h1>
        <p className="text-sm text-muted-foreground capitalize">Vista: {usuario?.rol ?? "fa"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle>Mis clientes</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{activos.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Mis prospectos</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{prospectos.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total AUM</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{formatUSD(aumTotalGeneral)}</CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card><CardHeader><CardTitle>AUM Local (Comitente Argentina)</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{formatUSD(aumLocalTotal)}</CardContent></Card>
        <Card><CardHeader><CardTitle>AUM Offshore (BCI / StoneX / Pershing)</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{formatUSD(aumOffshoreTotal)}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Comisiones totalizadas por mes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead><TR><TH>Mes</TH><TH>Total USD</TH></TR></THead>
            <TBody>
              {comisionesPorMesArr.map((m) => (
                <TR key={m.label}><TD>{m.label}</TD><TD className="tabular">{formatUSD(m.total)}</TD></TR>
              ))}
              {comisionesPorMesArr.length === 0 && <TR><TD colSpan={2} className="text-center text-muted-foreground py-6">Sin comisiones cargadas.</TD></TR>}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader><CardTitle>Pareto — AUM por cliente (80/20)</CardTitle></CardHeader>
          <CardContent>
            {paretoAum.length > 0 ? <ParetoChart data={paretoAum} /> : <p className="py-10 text-center text-sm text-muted-foreground">Sin datos de AUM.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pareto — Comisión YTD por cliente (80/20)</CardTitle></CardHeader>
          <CardContent>
            {paretoComision.length > 0 ? <ParetoChart data={paretoComision} /> : <p className="py-10 text-center text-sm text-muted-foreground">Sin comisiones cargadas.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Top clientes por AUM</CardTitle>
            <ExportExcelButton
              data={topAum.map((c) => ({ Cliente: `${c.nombre} ${c.apellido ?? ""}`, AUM: c.aum }))}
              filename="top_clientes_aum.xlsx"
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <THead><TR><TH>Cliente</TH><TH>AUM</TH></TR></THead>
              <TBody>
                {topAum.map((c) => (
                  <TR key={c.id}><TD>{c.nombre} {c.apellido}</TD><TD className="tabular">{formatUSD(c.aum)}</TD></TR>
                ))}
                {topAum.length === 0 && <TR><TD colSpan={2} className="text-center text-muted-foreground py-6">Sin datos de patrimonio.</TD></TR>}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Top clientes por comisión YTD</CardTitle>
            <ExportExcelButton
              data={topComision.map((c) => ({ Cliente: `${c.nombre} ${c.apellido ?? ""}`, ComisionUSD: c.comision }))}
              filename="top_clientes_comision.xlsx"
            />
          </CardHeader>
          <CardContent className="p-0">
            <TopComisionTable filas={topComision} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
