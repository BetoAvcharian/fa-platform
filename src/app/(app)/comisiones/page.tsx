import { createClient } from "@/lib/supabase/server";
import { ComisionesBrowser, type FilaComision } from "@/components/crm/comisiones-browser";

export default async function ComisionesPage() {
  const supabase = await createClient();

  const { data: comisiones } = await supabase.from("comisiones").select("*").limit(20000);
  const { data: cuentas } = await supabase.from("cuentas").select("id, numero_cuenta").limit(20000);
  const { data: titulares } = await supabase
    .from("cuenta_titulares")
    .select("cuenta_id, clientes:cliente_id (nombre, apellido)")
    .limit(20000);

  const cuentaIdPorNumero = new Map((cuentas ?? []).map((c) => [c.numero_cuenta, c.id]));
  const nombresPorCuentaId = new Map<string, string[]>();
  (titulares ?? []).forEach((t: any) => {
    const nombre = t.clientes ? `${t.clientes.nombre} ${t.clientes.apellido ?? ""}`.trim() : null;
    if (!nombre) return;
    const lista = nombresPorCuentaId.get(t.cuenta_id) ?? [];
    lista.push(nombre);
    nombresPorCuentaId.set(t.cuenta_id, lista);
  });

  const filas: FilaComision[] = (comisiones ?? []).map((c) => {
    let cliente_nombre = "— (premio sin cliente)";
    if (c.comitente) {
      const cuentaId = cuentaIdPorNumero.get(c.comitente);
      const nombres = cuentaId ? nombresPorCuentaId.get(cuentaId) : null;
      cliente_nombre = nombres && nombres.length > 0 ? nombres.join(" / ") : "(comitente sin cliente asociado)";
    }
    return {
      id: c.id,
      periodo_mes: c.periodo_mes,
      periodo_anio: c.periodo_anio,
      comitente: c.comitente,
      concepto: c.concepto,
      monto: Number(c.monto),
      cliente_nombre,
    };
  });

  const anios = Array.from(new Set(filas.map((f) => f.periodo_anio))).sort((a, b) => b - a);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Comisiones</h1>
        <p className="text-sm text-muted-foreground">Histórico completo de operaciones — filtrá por mes, año, cliente o comitente</p>
      </div>
      <ComisionesBrowser filas={filas} anios={anios} />
    </div>
  );
}
