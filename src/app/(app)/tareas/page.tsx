import { createClient } from "@/lib/supabase/server";
import { TareasView } from "@/components/crm/tareas-view";

export default async function TareasPage() {
  const supabase = await createClient();
  const { data: tareas } = await supabase
    .from("tareas")
    .select("*, clientes:cliente_id (nombre, apellido)")
    .order("fecha_vencimiento", { ascending: true });

  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, nombre, apellido")
    .order("nombre", { ascending: true });

  const rows = (tareas ?? []).map((t: any) => ({
    ...t,
    cliente_nombre: t.clientes ? `${t.clientes.nombre} ${t.clientes.apellido ?? ""}` : undefined,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Tareas</h1>
        <p className="text-sm text-muted-foreground">Lista y calendario</p>
      </div>
      <TareasView tareas={rows} clientes={clientes ?? []} />
    </div>
  );
}
