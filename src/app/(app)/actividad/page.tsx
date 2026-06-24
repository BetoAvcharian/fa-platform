import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { ActividadFeed } from "@/components/crm/actividad-feed";

export default async function ActividadPage() {
  const supabase = await createClient();

  const interacciones = await fetchAllRows((from, to) =>
    supabase
      .from("interacciones")
      .select("*, clientes:cliente_id (id, nombre, apellido)")
      .order("fecha", { ascending: false })
      .range(from, to)
  );

  const filas = interacciones.map((a: any) => ({
    id: a.id,
    fecha: a.fecha,
    tipo: a.tipo,
    asunto: a.asunto,
    detalle: a.detalle,
    cliente_id: a.clientes?.id ?? null,
    cliente_nombre: a.clientes ? `${a.clientes.nombre} ${a.clientes.apellido ?? ""}`.trim() : "Cliente eliminado",
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Actividad</h1>
        <p className="text-sm text-muted-foreground">Todas tus interacciones recientes, en un solo lugar</p>
      </div>
      <ActividadFeed filas={filas} />
    </div>
  );
}
