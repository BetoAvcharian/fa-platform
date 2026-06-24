"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { TareaDialog } from "@/components/crm/tarea-dialog";
import { createClient } from "@/lib/supabase/client";
import { Check, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Tarea } from "@/lib/types";

type TareaRow = Tarea & { cliente_nombre?: string; clientes_tarea?: { id: string; nombre: string; apellido: string | null }[] };
interface ClienteOption { id: string; nombre: string; apellido: string | null }

const PRIORIDAD_TONE = { alta: "danger", media: "warning", baja: "default" } as const;

export function TareasView({ tareas, clientes }: { tareas: TareaRow[]; clientes: ClienteOption[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [mesActual, setMesActual] = useState(new Date());
  const [tareaParaEditar, setTareaParaEditar] = useState<TareaRow | null>(null);
  const [fechaParaCrear, setFechaParaCrear] = useState<string | null>(null);

  async function marcarCompletada(id: string) {
    const { error } = await supabase.from("tareas").update({ estado: "completada" }).eq("id", id);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Tarea completada");
    router.refresh();
  }

  const diasDelMes = useMemo(() => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const inicioGrid = new Date(primerDia);
    inicioGrid.setDate(inicioGrid.getDate() - ((primerDia.getDay() + 6) % 7)); // empieza lunes

    const dias: Date[] = [];
    const cursor = new Date(inicioGrid);
    while (cursor <= ultimoDia || dias.length % 7 !== 0) {
      dias.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
      if (dias.length > 42) break;
    }
    return dias;
  }, [mesActual]);

  function tareasDelDia(d: Date) {
    const key = d.toISOString().slice(0, 10);
    return tareas.filter((t) => t.fecha_vencimiento === key);
  }

  return (
    <Tabs defaultValue="lista">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
        </TabsList>
        <TareaDialog clientes={clientes} />
      </div>

      <TabsContent value="lista">
        <Table>
          <THead>
            <TR><TH>Título</TH><TH>Clientes</TH><TH>Prioridad</TH><TH>Vencimiento</TH><TH>Estado</TH><TH></TH></TR>
          </THead>
          <TBody>
            {tareas.map((t) => (
              <TR key={t.id}>
                <TD>{t.titulo}</TD>
                <TD>{t.cliente_nombre || "—"}</TD>
                <TD><Badge variant={PRIORIDAD_TONE[t.prioridad]} className="capitalize">{t.prioridad}</Badge></TD>
                <TD>{t.fecha_vencimiento ?? "—"}</TD>
                <TD className="capitalize">{t.estado.replace("_", " ")}</TD>
                <TD>
                  <div className="flex justify-end gap-1">
                    <TareaDialog
                      clientes={clientes}
                      tarea={t}
                      clienteIdsIniciales={(t.clientes_tarea ?? []).map((c) => c.id)}
                      trigger={<Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>}
                    />
                    {t.estado !== "completada" && (
                      <Button size="icon" variant="ghost" onClick={() => marcarCompletada(t.id)}>
                        <Check className="h-3.5 w-3.5 text-success" />
                      </Button>
                    )}
                  </div>
                </TD>
              </TR>
            ))}
            {tareas.length === 0 && (
              <TR><TD colSpan={6} className="text-center text-muted-foreground py-8">No tenés tareas creadas todavía.</TD></TR>
            )}
          </TBody>
        </Table>
      </TabsContent>

      <TabsContent value="calendario">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))}>←</Button>
            <span className="text-sm font-medium capitalize">
              {mesActual.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="sm" onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))}>→</Button>
          </div>
          <p className="text-xs text-muted-foreground">Tocá un día vacío para crear una tarea, o una tarea para editarla.</p>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {diasDelMes.map((d, i) => {
              const enMes = d.getMonth() === mesActual.getMonth();
              const items = tareasDelDia(d);
              const key = d.toISOString().slice(0, 10);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFechaParaCrear(key)}
                  className={`min-h-[80px] rounded-md border border-border p-1.5 text-left text-xs transition-colors hover:border-accent ${enMes ? "" : "opacity-30"}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{d.getDate()}</span>
                    <Plus className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                  {items.slice(0, 3).map((t) => (
                    <p
                      key={t.id}
                      onClick={(e) => { e.stopPropagation(); setTareaParaEditar(t); }}
                      className="truncate rounded bg-accent/15 px-1 py-0.5 text-accent hover:bg-accent/25"
                    >
                      {t.titulo}
                    </p>
                  ))}
                  {items.length > 3 && <p className="text-muted-foreground">+{items.length - 3} más</p>}
                </button>
              );
            })}
          </div>
        </div>

        {/* diálogo controlado: se abre solo al tocar un día o una tarea del calendario */}
        <TareaDialog
          clientes={clientes}
          tarea={tareaParaEditar ?? undefined}
          clienteIdsIniciales={(tareaParaEditar?.clientes_tarea ?? []).map((c) => c.id)}
          fechaInicial={fechaParaCrear ?? undefined}
          trigger={null}
          open={!!(tareaParaEditar || fechaParaCrear)}
          onOpenChange={(o) => { if (!o) { setTareaParaEditar(null); setFechaParaCrear(null); } }}
        />
      </TabsContent>
    </Tabs>
  );
}
