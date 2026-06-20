import { createClient } from "@/lib/supabase/server";
import { NuevaLicitacionDialog } from "@/components/crm/nueva-licitacion-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function LicitacionesPage() {
  const supabase = await createClient();
  const { data: licitaciones } = await supabase
    .from("licitaciones")
    .select("*, licitacion_ordenes(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Licitaciones</h1>
          <p className="text-sm text-muted-foreground">Colocaciones primarias y órdenes de tus clientes</p>
        </div>
        <NuevaLicitacionDialog />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(licitaciones ?? []).map((l: any) => (
          <Link key={l.id} href={`/licitaciones/${l.id}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{l.nombre}</p>
                  <Badge variant="accent">{l.moneda_base}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{l.instrumento ?? "Sin instrumento especificado"}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {l.fecha_licitacion ?? "Sin fecha"} · {l.licitacion_ordenes?.[0]?.count ?? 0} órdenes
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(licitaciones ?? []).length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-12">No tenés licitaciones creadas todavía.</p>
        )}
      </div>
    </div>
  );
}
