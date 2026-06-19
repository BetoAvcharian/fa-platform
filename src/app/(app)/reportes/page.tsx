import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUSD } from "@/lib/utils";

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: usuario } = await supabase.from("usuarios").select("rol").eq("id", user?.id).single();

  const { data: clientes } = await supabase.from("clientes").select("*");
  const activos = (clientes ?? []).filter((c) => c.tipo === "cliente" && c.estado === "activo");
  const prospectos = (clientes ?? []).filter((c) => c.tipo === "prospecto");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Reportes</h1>
        <p className="text-sm text-muted-foreground capitalize">Vista: {usuario?.rol ?? "fa"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle>Mis clientes</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{activos.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Mis prospectos</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{prospectos.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Potencial en pipeline</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{formatUSD(prospectos.reduce((s,c)=>s+Number(c.potencial_usd ?? 0),0))}</CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Ranking de advisors, conversión de pipeline y vista global de Admin se agregan en la fase de Reportes avanzados (necesitan datos de varios FAs cargados).
        </CardContent>
      </Card>
    </div>
  );
}
