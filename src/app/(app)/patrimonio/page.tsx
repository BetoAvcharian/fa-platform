import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { PatrimonioBrowser, type FilaPatrimonio } from "@/components/crm/patrimonio-browser";

export default async function PatrimonioPage() {
  const supabase = await createClient();

  const [patrimonio, cuentas, titulares] = await Promise.all([
    fetchAllRows((from, to) => supabase.from("patrimonio").select("*").range(from, to)),
    fetchAllRows((from, to) => supabase.from("cuentas").select("id, numero_cuenta").range(from, to)),
    fetchAllRows((from, to) =>
      supabase.from("cuenta_titulares").select("cuenta_id, clientes:cliente_id (nombre, apellido)").range(from, to)
    ),
  ]);

  const cuentaIdPorNumero = new Map(cuentas.map((c) => [c.numero_cuenta, c.id]));
  const nombresPorCuentaId = new Map<string, string[]>();
  titulares.forEach((t: any) => {
    const nombre = t.clientes ? `${t.clientes.nombre} ${t.clientes.apellido ?? ""}`.trim() : null;
    if (!nombre) return;
    const lista = nombresPorCuentaId.get(t.cuenta_id) ?? [];
    lista.push(nombre);
    nombresPorCuentaId.set(t.cuenta_id, lista);
  });

  const filas: FilaPatrimonio[] = patrimonio.map((p) => {
    const cuentaId = cuentaIdPorNumero.get(p.numero_cuenta);
    const nombres = cuentaId ? nombresPorCuentaId.get(cuentaId) : null;
    return {
      id: p.id,
      fecha_carga: p.fecha_carga,
      numero_cuenta: p.numero_cuenta,
      aum: Number(p.aum),
      cash: Number(p.cash),
      cliente_nombre: nombres && nombres.length > 0 ? nombres.join(" / ") : "(comitente sin cliente asociado)",
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Patrimonio</h1>
        <p className="text-sm text-muted-foreground">
          Histórico completo de AUM — si algo se subió mal, lo corregís o lo borrás desde acá.
        </p>
      </div>
      <PatrimonioBrowser filas={filas} />
    </div>
  );
}
