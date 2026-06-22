import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrdenesTable } from "@/components/crm/ordenes-table";
import { BackButton } from "@/components/ui/back-button";

export default async function LicitacionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: licitacion } = await supabase.from("licitaciones").select("*").eq("id", id).single();
  if (!licitacion) notFound();

  const { data: ordenes } = await supabase
    .from("licitacion_ordenes")
    .select("*, clientes:cliente_id (nombre, apellido)")
    .eq("licitacion_id", id)
    .order("created_at", { ascending: true });

  const { data: clientes } = await supabase.from("clientes").select("id, nombre, apellido").order("nombre");

  const rows = (ordenes ?? []).map((o: any) => ({
    ...o,
    cliente_nombre: o.clientes ? `${o.clientes.nombre} ${o.clientes.apellido ?? ""}` : "—",
  }));

  return (
    <div className="space-y-6">
      <BackButton label="Volver a licitaciones" />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{licitacion.nombre}</h1>
          <p className="text-sm text-muted-foreground">{licitacion.instrumento ?? "Sin instrumento especificado"}</p>
        </div>
        <Badge variant="accent">{licitacion.moneda_base}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Fecha licitación</p><p className="mt-1 font-medium">{licitacion.fecha_licitacion ?? "—"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Fecha liquidación</p><p className="mt-1 font-medium">{licitacion.fecha_liquidacion ?? "—"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Órdenes</p><p className="mt-1 font-medium">{rows.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Moneda base</p><p className="mt-1 font-medium">{licitacion.moneda_base}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Órdenes por cliente</CardTitle></CardHeader>
        <CardContent>
          <OrdenesTable licitacionId={id} ordenes={rows} clientes={clientes ?? []} monedaBase={licitacion.moneda_base} arancelPct={licitacion.arancel_pct} />
        </CardContent>
      </Card>
    </div>
  );
}
