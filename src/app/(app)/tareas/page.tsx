import { createClient } from "@/lib/supabase/server";
import { TareasView } from "@/components/crm/tareas-view";

export default async function TareasPage() {
  const supabase = await createClient();

  const [{ data: tareas }, { data: clientes }, { data: vinculos }] = await Promise.all([
    supabase.from("tareas").select("*").order("fecha_vencimiento", { ascending: true }),
    supabase.from("clientes").select("id, nombre, apellido").order("nombre", { ascending: true }),
    supabase.from("tarea_clientes").select("tarea_id, clientes:cliente_id (id, nombre, apellido)"),
  ]);

  const clientesPorTarea = new Map<string, { id: string; nombre: string; apellido: string | null }[]>();
  (vinculos ?? []).forEach((v: any) => {
    if (!v.clientes) return;
    const lista = clientesPorTarea.get(v.tarea_id) ?? [];
    lista.push(v.clientes);
    clientesPorTarea.set(v.tarea_id, lista);
  });

  const rows = (tareas ?? []).map((t: any) => {
    const clientesDeTarea = clientesPorTarea.get(t.id) ?? [];
    return {
      ...t,
      clientes_tarea: clientesDeTarea,
      cliente_nombre: clientesDeTarea.map((c) => `${c.nombre} ${c.apellido ?? ""}`).join(", "),
    };
  });

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
