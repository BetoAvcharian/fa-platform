import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { diasDesde } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default async function OportunidadesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase.from("clientes").select("*").eq("estado", "activo");
  const { data: tareas } = await supabase.from("tareas").select("*").neq("estado", "completada");

  const sinContacto60 = (clientes ?? []).filter((c) => (diasDesde(c.fecha_ultimo_contacto) ?? 0) > 60);
  const sinContacto90 = (clientes ?? []).filter((c) => (diasDesde(c.fecha_ultimo_contacto) ?? 0) > 90);
  const tareasVencidas = (tareas ?? []).filter((t) => t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date());

  const alertas = [
    ...sinContacto90.map((c) => ({ tipo: "Sin contacto +90 días", cliente: `${c.nombre} ${c.apellido}`, severidad: "danger" as const })),
    ...sinContacto60.map((c) => ({ tipo: "Sin contacto +60 días", cliente: `${c.nombre} ${c.apellido}`, severidad: "warning" as const })),
    ...tareasVencidas.map((t) => ({ tipo: "Tarea vencida", cliente: t.titulo, severidad: "danger" as const })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Oportunidades</h1>
        <p className="text-sm text-muted-foreground">Alertas automáticas</p>
      </div>
      <div className="space-y-2">
        {alertas.map((a, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <div>
                  <p className="text-sm font-medium">{a.tipo}</p>
                  <p className="text-xs text-muted-foreground">{a.cliente}</p>
                </div>
              </div>
              <Badge variant={a.severidad}>{a.severidad === "danger" ? "Urgente" : "Atención"}</Badge>
            </CardContent>
          </Card>
        ))}
        {alertas.length === 0 && <p className="text-center text-muted-foreground py-8">Sin alertas activas.</p>}
      </div>
    </div>
  );
}
