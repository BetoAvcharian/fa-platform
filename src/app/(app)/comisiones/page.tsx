import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { ComisionesBrowser, type FilaComisionResumen } from "@/components/crm/comisiones-browser";

export default async function ComisionesPage() {
  const supabase = await createClient();

  // Estas tres consultas ya vienen sumadas desde la base (vistas SQL),
  // nunca traen las miles de operaciones individuales a la app.
  // Igual las pedimos paginadas por si algún día el resumen mismo supera 1000 filas.
  const [porClienteMes, sinCliente, clientesInfo] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase.from("v_comisiones_por_cliente_mes").select("cliente_id, periodo_mes, periodo_anio, total, operaciones").range(from, to)
    ),
    fetchAllRows((from, to) =>
      supabase.from("v_comisiones_sin_cliente_por_mes").select("periodo_mes, periodo_anio, total, operaciones").range(from, to)
    ),
    fetchAllRows((from, to) =>
      supabase.from("clientes").select("id, nombre, apellido").range(from, to)
    ),
  ]);

  const nombrePorClienteId = new Map(clientesInfo.map((c) => [c.id, `${c.nombre} ${c.apellido ?? ""}`.trim()]));

  const filas: FilaComisionResumen[] = [
    ...porClienteMes.map((c) => ({
      id: `${c.cliente_id}-${c.periodo_anio}-${c.periodo_mes}`,
      periodo_mes: c.periodo_mes,
      periodo_anio: c.periodo_anio,
      cliente_nombre: nombrePorClienteId.get(c.cliente_id) ?? "(cliente no encontrado)",
      total: Number(c.total),
      operaciones: c.operaciones,
    })),
    ...sinCliente.map((c) => ({
      id: `sin-cliente-${c.periodo_anio}-${c.periodo_mes}`,
      periodo_mes: c.periodo_mes,
      periodo_anio: c.periodo_anio,
      cliente_nombre: "— (premio sin cliente)",
      total: Number(c.total),
      operaciones: c.operaciones,
    })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Comisiones</h1>
        <p className="text-sm text-muted-foreground">Totalizado por cliente y por mes</p>
      </div>
      <ComisionesBrowser filas={filas} />
    </div>
  );
}
