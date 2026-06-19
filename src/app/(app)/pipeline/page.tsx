import { createClient } from "@/lib/supabase/server";
import { PipelineBoard } from "@/components/crm/pipeline-board";

export default async function PipelinePage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*, usuarios:owner_id (nombre, apellido)")
    .eq("tipo", "prospecto");

  const rows = (clientes ?? []).map((c: any) => ({
    ...c,
    owner_nombre: c.usuarios ? `${c.usuarios.nombre} ${c.usuarios.apellido}` : undefined,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Pipeline comercial</h1>
        <p className="text-sm text-muted-foreground">Arrastrá las tarjetas para cambiar de etapa</p>
      </div>
      <PipelineBoard clientes={rows} />
    </div>
  );
}
