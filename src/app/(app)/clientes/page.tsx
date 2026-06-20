import { createClient } from "@/lib/supabase/server";
import { ClientesTable } from "@/components/crm/clientes-table";
import { NuevoClienteDialog } from "@/components/crm/nuevo-cliente-dialog";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("*, usuarios:owner_id (nombre, apellido)")
    .eq("tipo", "cliente")
    .eq("estado", "activo")
    .order("created_at", { ascending: false });

  const { data: titulares } = await supabase.from("cuenta_titulares").select("cliente_id, cuentas:cuenta_id (numero_cuenta)");
  const { data: patrimonio } = await supabase.from("patrimonio").select("numero_cuenta, aum, fecha_carga").order("fecha_carga", { ascending: false });

  const aumPorCuenta = new Map<string, number>();
  (patrimonio ?? []).forEach((p) => {
    if (!aumPorCuenta.has(p.numero_cuenta)) aumPorCuenta.set(p.numero_cuenta, Number(p.aum));
  });
  const aumPorCliente = new Map<string, number>();
  (titulares ?? []).forEach((t: any) => {
    const aum = aumPorCuenta.get(t.cuentas?.numero_cuenta) ?? 0;
    aumPorCliente.set(t.cliente_id, (aumPorCliente.get(t.cliente_id) ?? 0) + aum);
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
      <ClientesTable clientes={rows} />
    </div>
  );
}
