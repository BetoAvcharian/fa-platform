import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { ClientesTable } from "@/components/crm/clientes-table";

export default async function ExClientesPage() {
  const supabase = await createClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("*, usuarios:owner_id (nombre, apellido)")
    .eq("tipo", "cliente")
    .eq("estado", "perdido")
    .order("updated_at", { ascending: false });

  const rows = (clientes ?? []).map((c: any) => ({
    ...c,
    owner_nombre: c.usuarios ? `${c.usuarios.nombre} ${c.usuarios.apellido}` : undefined,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Ex Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Clientes con estado "Perdido". Para mover uno acá, editá su ficha y cambiá el Estado a Perdido.
        </p>
      </div>
      <Suspense fallback={null}>
        <ClientesTable clientes={rows} />
      </Suspense>
    </div>
  );
}
