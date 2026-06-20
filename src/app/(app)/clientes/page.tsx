import { createClient } from "@/lib/supabase/server";
import { ClientesTable } from "@/components/crm/clientes-table";
import { NuevoClienteDialog } from "@/components/crm/nuevo-cliente-dialog";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("*, usuarios:owner_id (nombre, apellido)")
    .order("created_at", { ascending: false });

  const rows = (clientes ?? []).map((c: any) => ({
    ...c,
    owner_nombre: c.usuarios ? `${c.usuarios.nombre} ${c.usuarios.apellido}` : undefined,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">CRM de clientes y prospectos</p>
        </div>
        <NuevoClienteDialog />
      </div>
      <ClientesTable clientes={rows} />
    </div>
  );
}
