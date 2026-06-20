import { createClient } from "@/lib/supabase/server";
import { ProspectosTable } from "@/components/crm/prospectos-table";
import { NuevoClienteDialog } from "@/components/crm/nuevo-cliente-dialog";

export default async function ProspectosPage() {
  const supabase = await createClient();

  const { data: prospectos } = await supabase
    .from("clientes")
    .select("*, usuarios:owner_id (nombre, apellido)")
    .eq("tipo", "prospecto")
    .neq("estado", "perdido")
    .order("created_at", { ascending: false });

  const rows = (prospectos ?? []).map((c: any) => ({
    ...c,
    owner_nombre: c.usuarios ? `${c.usuarios.nombre} ${c.usuarios.apellido}` : undefined,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Prospectos</h1>
          <p className="text-sm text-muted-foreground">Cuando cambiás el tipo a "Cliente" desde su ficha, pasa solo a la sección Clientes</p>
        </div>
        <NuevoClienteDialog tipoDefault="prospecto" />
      </div>
      <ProspectosTable prospectos={rows} />
    </div>
  );
}
