import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { ComisionesBrowser, type FilaComisionResumen } from "@/components/crm/comisiones-browser";

export default async function ComisionesPage() {
  const supabase = await createClient();

  const comisiones = await fetchAllRows((from, to) => supabase.from("comisiones").select("*").range(from, to));
  const cuentas = await fetchAllRows((from, to) => supabase.from("cuentas").select("id, numero_cuenta").range(from, to));
  const titulares = await fetchAllRows((from, to) =>
    supabase.from("cuenta_titulares").select("cuenta_id, clientes:cliente_id (nombre, apellido)").range(from, to)
  );

  const cuentaIdPorNumero = new Map(cuentas.map((c) => [c.numero_cuenta, c.id]));
  const nombresPorCuentaId = new Map<string, string[]>();
  titulares.forEach((t: any) => {
    const nombre = t.clientes ? `${t.clientes.nombre} ${t.clientes.apellido ?? ""}`.trim() : null;
    if (!nombre) return;
    const lista = nombresPorCuentaId.get(t.cuenta_id) ?? [];
    lista.push(nombre);
    nombresPorCuentaId.set(t.cuenta_id, lista);
  });

  // agrupar por Cliente + Mes/Año (no por operación individual)
  const resumen = new Map<string, FilaComisionResumen>();
  comisiones.forEach((c) => {
    let cliente_nombre = "— (premio sin cliente)";
    if (c.comitente) {
      const cuentaId = cuentaIdPorNumero.get(c.comitente);
      const nombres = cuentaId ? nombresPorCuentaId.get(cuentaId) : null;
      cliente_nombre = nombres && nombres.length > 0 ? nombres.join(" / ") : "(comitente sin cliente asociado)";
    }
    const key = `${cliente_nombre}__${c.periodo_anio}-${c.periodo_mes}`;
    const existente = resumen.get(key);
    if (existente) {
      existente.total += Number(c.monto);
      existente.operaciones += 1;
    } else {
      resumen.set(key, {
        id: key,
        periodo_mes: c.periodo_mes,
        periodo_anio: c.periodo_anio,
        cliente_nombre,
        total: Number(c.monto),
        operaciones: 1,
      });
    }
  });

  const filas = Array.from(resumen.values());
  const anios = Array.from(new Set(filas.map((f) => f.periodo_anio))).sort((a, b) => b - a);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Comisiones</h1>
        <p className="text-sm text-muted-foreground">Totalizado por cliente y por mes — filtrá por año, mes o cliente</p>
      </div>
      <ComisionesBrowser filas={filas} anios={anios} />
    </div>
  );
}
