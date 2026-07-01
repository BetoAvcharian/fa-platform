import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { ProspectosTable } from "@/components/crm/prospectos-table";
import { NuevoClienteDialog } from "@/components/crm/nuevo-cliente-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUSD } from "@/lib/utils";
import { TrendingUp, UserCheck, UserX, BarChart2 } from "lucide-react";

export default async function ProspectosPage() {
  const supabase = await createClient();

  const { data: prospectos } = await supabase
    .from("clientes")
    .select("*, usuarios:owner_id (nombre, apellido)")
    .eq("tipo", "prospecto")
    .neq("estado", "perdido")
    .order("created_at", { ascending: false });

  const rows = (prospectos ?? []).map((c: any) => ({
    ...c,
    owner_nombre: c.usuarios ? `${c.usuarios.nombre} ${c.usuarios.apellido}` : undefined,
  }));

  // métricas
  const total = rows.length;
  const aumProyectado = rows.reduce((s, p) => s + Number(p.potencial_usd ?? 0), 0);
  const enSeguimiento = rows.filter((p) => p.prospecto_trabajando).length;
  const sinContacto30 = rows.filter((p) => {
    if (!p.fecha_ultimo_contacto) return true; // nunca contactado
    const dias = Math.floor((Date.now() - new Date(p.fecha_ultimo_contacto).getTime()) / 86400000);
    return dias >= 30;
  }).length;
  const promedioPotencial = total > 0 ? aumProyectado / total : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Prospectos</h1>
          <p className="text-sm text-muted-foreground">Cuando cambiás el tipo a "Cliente" desde su ficha, pasa solo a la sección Clientes</p>
        </div>
        <NuevoClienteDialog tipoDefault="prospecto" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">AUM Proyectado</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{formatUSD(aumProyectado)}</p>
            <p className="text-xs text-muted-foreground">Suma de potenciales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">En seguimiento</CardTitle>
            <UserCheck className="h-3.5 w-3.5 text-success" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{enSeguimiento}</p>
            <p className="text-xs text-muted-foreground">de {total} en total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Fríos (+30 días)</CardTitle>
            <UserX className="h-3.5 w-3.5 text-warning" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{sinContacto30}</p>
            <p className="text-xs text-muted-foreground">sin contacto reciente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Ticket promedio</CardTitle>
            <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{formatUSD(promedioPotencial)}</p>
            <p className="text-xs text-muted-foreground">por prospecto</p>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={null}>
        <ProspectosTable prospectos={rows} />
      </Suspense>
    </div>
  );
}
