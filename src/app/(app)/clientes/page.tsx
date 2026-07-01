import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { Suspense } from "react";
import { ClientesTable } from "@/components/crm/clientes-table";
import { NuevoClienteDialog } from "@/components/crm/nuevo-cliente-dialog";

export default async function ClientesPage() {
  const supabase = await createClient();

  const [{ data: clientes }, titulares, patrimonio] = await Promise.all([
    supabase
      .from("clientes")
      .select("*, usuarios:owner_id (nombre, apellido)")
      .eq("tipo", "cliente")
      .eq("estado", "activo")
      .order("created_at", { ascending: false }),
    fetchAllRows((from, to) =>
      supabase.from("cuenta_titulares").select("cliente_id, cuenta_id, cuentas:cuenta_id (numero_cuenta)").range(from, to)
    ),
    fetchAllRows((from, to) =>
      supabase.from("patrimonio").select("numero_cuenta, aum, fecha_carga").order("fecha_carga", { ascending: false }).range(from, to)
    ),
  ]);

  // AUM: siempre del último mes cargado en el sistema (globalmente).
  // Si un cliente no tiene dato en ese mes, es 0 — no mostrar un dato viejo.
  const ultimaFecha = patrimonio.length > 0 ? patrimonio[patrimonio.length - 1].fecha_carga : null;
  const aumPorCuenta = new Map<string, number>();
  if (ultimaFecha) {
    patrimonio
      .filter((p) => p.fecha_carga === ultimaFecha)
      .forEach((p) => aumPorCuenta.set(p.numero_cuenta, Number(p.aum)));
  }

  // si una cuenta tiene más de un titular (mancomunada), se divide entre todos
  // para que el AUM total de la lista no quede duplicado
  const titularesPorCuenta = new Map<string, number>();
  titulares.forEach((t: any) => {
    titularesPorCuenta.set(t.cuenta_id, (titularesPorCuenta.get(t.cuenta_id) ?? 0) + 1);
  });

  const aumPorCliente = new Map<string, number>();
  titulares.forEach((t: any) => {
    const aum = aumPorCuenta.get(t.cuentas?.numero_cuenta) ?? 0;
    const cantidadTitulares = titularesPorCuenta.get(t.cuenta_id) ?? 1;
    aumPorCliente.set(t.cliente_id, (aumPorCliente.get(t.cliente_id) ?? 0) + aum / cantidadTitulares);
  });

  const rows = (clientes ?? []).map((c: any) => ({
    ...c,
    owner_nombre: c.usuarios ? `${c.usuarios.nombre} ${c.usuarios.apellido}` : undefined,
    aum: aumPorCliente.get(c.id) ?? 0,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">Clientes activos</p>
        </div>
        <NuevoClienteDialog tipoDefault="cliente" />
      </div>
      <Suspense fallback={null}>
        <ClientesTable clientes={rows} />
      </Suspense>
    </div>
  );
}
