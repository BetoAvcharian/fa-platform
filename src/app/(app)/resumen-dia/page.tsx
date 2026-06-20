import { createClient } from "@/lib/supabase/server";
import { ResumenDelDia } from "@/components/crm/resumen-del-dia";

export default async function ResumenDiaPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase.from("clientes").select("*").eq("estado", "activo");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Resumen del día</h1>
        <p className="text-sm text-muted-foreground">Registrá contactos, dejá notas, y armá tareas de seguimiento sin salir de acá</p>
      </div>
      <ResumenDelDia clientes={clientes ?? []} />
    </div>
  );
}
