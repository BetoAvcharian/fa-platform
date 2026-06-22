import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { StatCard } from "@/components/crm/stat-card";
import { AumChart } from "@/components/crm/aum-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUSD, diasDesde } from "@/lib/utils";
import { Wallet, Users, UserPlus, CheckSquare, AlertTriangle, Gavel, Cake } from "lucide-react";
import Link from "next/link";
import { SinContactoRow } from "@/components/crm/sin-contacto-row";

export default async function DashboardPage() {
  const supabase = await createClient();

  const clientes = await fetchAllRows((from, to) => supabase.from("clientes").select("*").range(from, to));
  const { data: tareas } = await supabase
    .from("tareas")
    .select("*")
    .neq("estado", "completada");
  const patrimonio = await fetchAllRows((from, to) =>
    supabase.from("patrimonio").select("fecha_carga, aum").order("fecha_carga", { ascending: true }).range(from, to)
  );
  const { data: licitaciones } = await supabase
    .from("licitaciones")
    .select("*")
    .order("fecha_licitacion", { ascending: true });
  const comisionesPorMesRaw = await fetchAllRows((from, to) =>
    supabase.from("v_comisiones_por_mes").select("periodo_mes, periodo_anio, total").range(from, to)
  );

  const todosClientes = clientes;
  const activos = todosClientes.filter((c) => c.tipo === "cliente" && c.estado === "activo");
  const prospectos = todosClientes.filter((c) => c.tipo === "prospecto" && c.estado === "activo");

  const sinContacto30 = activos.filter((c) => (diasDesde(c.fecha_ultimo_contacto) ?? 0) >= 30 && (diasDesde(c.fecha_ultimo_contacto) ?? 0) < 60);
  const sinContacto60 = activos.filter((c) => (diasDesde(c.fecha_ultimo_contacto) ?? 0) >= 60 && (diasDesde(c.fecha_ultimo_contacto) ?? 0) < 90);
  const sinContacto90 = activos.filter((c) => (diasDesde(c.fecha_ultimo_contacto) ?? 0) >= 90);

  // agrupar AUM histórico por mes (queda el último valor de cada mes, suma de todas las cuentas)
  const aumPorFecha = new Map<string, number>();
  patrimonio.forEach((p) => {
    aumPorFecha.set(p.fecha_carga, (aumPorFecha.get(p.fecha_carga) ?? 0) + Number(p.aum));
  });
  const aumPorMes = new Map<string, number>();
  Array.from(aumPorFecha.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([fecha, total]) => {
      const mes = fecha.slice(0, 7); // YYYY-MM
      aumPorMes.set(mes, total); // se queda con el último valor del mes
    });

  // comisiones por mes (ya viene sumado desde la vista de la base)
  const comisionesPorMes = new Map<string, number>();
  comisionesPorMesRaw.forEach((c) => {
    const mes = `${c.periodo_anio}-${String(c.periodo_mes).padStart(2, "0")}`;
    comisionesPorMes.set(mes, Number(c.total));
  });

  const todosLosMeses = Array.from(new Set([...aumPorMes.keys(), ...comisionesPorMes.keys()])).sort();
  const chartData = todosLosMeses.map((mes) => {
    const aum = aumPorMes.get(mes) ?? null;
    const com = comisionesPorMes.get(mes) ?? null;
    const roa = aum && com && aum > 0 ? (com / aum) * 100 : null;
    return { fecha: mes, aum, comisiones: com, roa };
  });
  const aumActual = [...aumPorMes.values()].at(-1) ?? 0;

  const tareasPendientes = tareas ?? [];
  const hoy = new Date();
  const en21Dias = new Date();
  en21Dias.setDate(hoy.getDate() + 21);
  const licitacionesProximas = (licitaciones ?? []).filter((l) => {
    if (!l.fecha_licitacion) return false;
    const f = new Date(l.fecha_licitacion);
    return f >= hoy && f <= en21Dias;
  });

  const cumpleañosProximos = todosClientes
    .filter((c) => c.fecha_nacimiento)
    .map((c) => {
      const nacimiento = new Date(c.fecha_nacimiento as string);
      const esteAño = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
      if (esteAño < hoy) esteAño.setFullYear(hoy.getFullYear() + 1);
      const diasFaltan = Math.round((esteAño.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      return { ...c, diasFaltan };
    })
    .filter((c) => c.diasFaltan <= 15)
    .sort((a, b) => a.diasFaltan - b.diasFaltan);
  const proximosSeguimientos = todosClientes
    .filter((c) => c.fecha_ultimo_contacto)
    .sort((a, b) => (diasDesde(a.fecha_ultimo_contacto) ?? 0) - (diasDesde(b.fecha_ultimo_contacto) ?? 0))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen general de tu cartera</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="AUM total" value={formatUSD(aumActual)} icon={Wallet} tone="success" />
        <StatCard label="Clientes activos" value={String(activos.length)} icon={Users} />
        <StatCard label="Prospectos activos" value={String(prospectos.length)} icon={UserPlus} />
        <StatCard label="Tareas pendientes" value={String(tareasPendientes.length)} icon={CheckSquare} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolución de AUM, Comisiones y ROA</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <AumChart data={chartData} />
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Todavía no hay carga de patrimonio histórico. Subila desde Importador.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes sin contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SinContactoRow label="30-60 días" clientes={sinContacto30} tone="warning" />
            <SinContactoRow label="60-90 días" clientes={sinContacto60} tone="warning" />
            <SinContactoRow label="+90 días" clientes={sinContacto90} tone="danger" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos seguimientos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {proximosSeguimientos.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin datos de contacto cargados.</p>
            )}
            {proximosSeguimientos.map((c) => (
              <Link
                key={c.id}
                href={`/clientes/${c.id}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <span className="text-sm">{c.nombre} {c.apellido}</span>
                <Badge variant="default">{diasDesde(c.fecha_ultimo_contacto)} días</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {sinContacto90.length > 0 && (
              <p>⚠️ <strong>{sinContacto90.length}</strong> clientes sin contacto hace más de 90 días.</p>
            )}
            {tareasPendientes.filter((t) => t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date()).length > 0 && (
              <p>⚠️ Tenés tareas vencidas. Revisalas en la sección Tareas.</p>
            )}
            {sinContacto90.length === 0 && tareasPendientes.length === 0 && (
              <p className="text-muted-foreground">Sin alertas activas por el momento.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-4 w-4 text-accent" /> Licitaciones próximas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {licitacionesProximas.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin licitaciones programadas en los próximos 21 días.</p>
            )}
            {licitacionesProximas.map((l) => (
              <Link
                key={l.id}
                href={`/licitaciones/${l.id}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <span className="text-sm">{l.nombre}</span>
                <Badge variant="accent">{l.fecha_licitacion}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-accent" /> Cumpleaños próximos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cumpleañosProximos.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin cumpleaños en los próximos 15 días.</p>
            )}
            {cumpleañosProximos.map((c) => (
              <Link
                key={c.id}
                href={`/clientes/${c.id}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <span className="text-sm">{c.nombre} {c.apellido}</span>
                <Badge variant="accent">{c.diasFaltan === 0 ? "Hoy" : `en ${c.diasFaltan}d`}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: number; tone: "warning" | "danger" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={tone}>{value}</Badge>
    </div>
  );
}
