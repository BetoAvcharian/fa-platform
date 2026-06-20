import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD } from "@/lib/utils";
import { ExportExcelButton } from "@/components/crm/export-excel-button";

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: usuario } = await supabase.from("usuarios").select("rol").eq("id", user?.id).single();

  const { data: clientes } = await supabase.from("clientes").select("*");
  const { data: cuentas } = await supabase.from("cuentas").select("*");
  const { data: titulares } = await supabase.from("cuenta_titulares").select("*");
  const { data: patrimonio } = await supabase.from("patrimonio").select("*").order("fecha_carga", { ascending: false });
  const { data: comisiones } = await supabase.from("comisiones").select("*");

  const cuentaPorId = new Map((cuentas ?? []).map((c) => [c.id, c]));

  const activos = (clientes ?? []).filter((c) => c.tipo === "cliente" && c.estado === "activo");
  const prospectos = (clientes ?? []).filter((c) => c.tipo === "prospecto" && c.estado !== "perdido");

  // AUM más reciente por número de cuenta
  const aumPorCuenta = new Map<string, number>();
  (patrimonio ?? []).forEach((p) => {
    if (!aumPorCuenta.has(p.numero_cuenta)) aumPorCuenta.set(p.numero_cuenta, Number(p.aum));
  });

  // AUM por cliente — pasando por la tabla de titulares (una cuenta puede sumar a 2 clientes si es mancomunada)
  const aumPorCliente = new Map<string, number>();
  const cuentasPorCliente = new Map<string, Set<string>>(); // numero_cuenta visibles por cliente (para comisiones)
  (titulares ?? []).forEach((t) => {
    const cuenta = cuentaPorId.get(t.cuenta_id);
    if (!cuenta) return;
    const aum = aumPorCuenta.get(cuenta.numero_cuenta) ?? 0;
    aumPorCliente.set(t.cliente_id, (aumPorCliente.get(t.cliente_id) ?? 0) + aum);
    const set = cuentasPorCliente.get(t.cliente_id) ?? new Set<string>();
    set.add(cuenta.numero_cuenta);
    cuentasPorCliente.set(t.cliente_id, set);
  });

  const comisionPorCliente = new Map<string, number>();
  let comisionesSinCliente = 0;
  (comisiones ?? []).forEach((com) => {
    if (!com.comitente) {
      comisionesSinCliente += Number(com.monto);
      return;
    }
    // "comitente" en comisiones se matchea contra numero_cuenta de la cuenta
    const cuenta = (cuentas ?? []).find((cu) => cu.numero_cuenta === com.comitente);
    if (cuenta) {
      const titularesDeEstaCuenta = (titulares ?? []).filter((t) => t.cuenta_id === cuenta.id);
      titularesDeEstaCuenta.forEach((t) => {
        comisionPorCliente.set(t.cliente_id, (comisionPorCliente.get(t.cliente_id) ?? 0) + Number(com.monto));
      });
    }
  });

  const topAum = [...(clientes ?? [])]
    .map((c) => ({ ...c, aum: aumPorCliente.get(c.id) ?? 0 }))
    .sort((a, b) => b.aum - a.aum)
    .slice(0, 10);

  const topPotencial = [...(clientes ?? [])]
    .sort((a, b) => (b.potencial_usd ?? 0) - (a.potencial_usd ?? 0))
    .slice(0, 10);

  const topComision = [...(clientes ?? [])]
    .map((c) => ({ ...c, comision: comisionPorCliente.get(c.id) ?? 0 }))
    .filter((c) => c.comision > 0)
    .sort((a, b) => b.comision - a.comision)
    .slice(0, 10);

  // AUM Local vs Offshore (según plaza de cada cuenta)
  let aumLocalTotal = 0;
  let aumOffshoreTotal = 0;
  (cuentas ?? []).forEach((cuenta) => {
    const aum = aumPorCuenta.get(cuenta.numero_cuenta) ?? 0;
    if (cuenta.plaza === "local") aumLocalTotal += aum;
    else aumOffshoreTotal += aum;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Reportes</h1>
        <p className="text-sm text-muted-foreground capitalize">Vista: {usuario?.rol ?? "fa"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle>Mis clientes</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{activos.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Mis prospectos</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{prospectos.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Comisiones sin cliente (premios)</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{formatUSD(comisionesSinCliente)}</CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card><CardHeader><CardTitle>AUM Local (Comitente Argentina)</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{formatUSD(aumLocalTotal)}</CardContent></Card>
        <Card><CardHeader><CardTitle>AUM Offshore (BCI / StoneX / Pershing)</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{formatUSD(aumOffshoreTotal)}</CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
            <CardTitle>Top clientes por potencial</CardTitle>
            <ExportExcelButton
              data={topPotencial.map((c) => ({ Cliente: `${c.nombre} ${c.apellido ?? ""}`, PotencialUSD: c.potencial_usd ?? 0 }))}
              filename="top_clientes_potencial.xlsx"
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <THead><TR><TH>Cliente</TH><TH>Potencial</TH></TR></THead>
              <TBody>
                {topPotencial.map((c) => (
                  <TR key={c.id}><TD>{c.nombre} {c.apellido}</TD><TD className="tabular">{formatUSD(c.potencial_usd ?? 0)}</TD></TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Top clientes por comisión generada</CardTitle>
            <ExportExcelButton
              data={topComision.map((c) => ({ Cliente: `${c.nombre} ${c.apellido ?? ""}`, ComisionUSD: c.comision }))}
              filename="top_clientes_comision.xlsx"
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <THead><TR><TH>Cliente</TH><TH>Comisión</TH></TR></THead>
              <TBody>
                {topComision.map((c) => (
                  <TR key={c.id}><TD>{c.nombre} {c.apellido}</TD><TD className="tabular">{formatUSD(c.comision)}</TD></TR>
                ))}
                {topComision.length === 0 && <TR><TD colSpan={2} className="text-center text-muted-foreground py-6">Sin comisiones cargadas.</TD></TR>}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
