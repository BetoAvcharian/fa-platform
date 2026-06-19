import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const PRIORIDAD_TONE = { alta: "danger", media: "warning", baja: "default" } as const;

export default async function TareasPage() {
  const supabase = await createClient();
  const { data: tareas } = await supabase
    .from("tareas")
    .select("*, clientes:cliente_id (nombre, apellido)")
    .order("fecha_vencimiento", { ascending: true });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Tareas</h1>
        <p className="text-sm text-muted-foreground">Vista lista — la vista calendario llega en la próxima fase</p>
      </div>

      <Table>
        <THead>
          <TR><TH>Título</TH><TH>Cliente</TH><TH>Prioridad</TH><TH>Vencimiento</TH><TH>Estado</TH></TR>
        </THead>
        <TBody>
          {(tareas ?? []).map((t: any) => (
            <TR key={t.id}>
              <TD>{t.titulo}</TD>
              <TD>{t.clientes ? `${t.clientes.nombre} ${t.clientes.apellido ?? ""}` : "—"}</TD>
              <TD><Badge variant={PRIORIDAD_TONE[t.prioridad as keyof typeof PRIORIDAD_TONE]} className="capitalize">{t.prioridad}</Badge></TD>
              <TD>{t.fecha_vencimiento ?? "—"}</TD>
              <TD className="capitalize">{t.estado.replace("_", " ")}</TD>
            </TR>
          ))}
          {(tareas ?? []).length === 0 && (
            <TR><TD colSpan={5} className="text-center text-muted-foreground py-8">No tenés tareas creadas todavía.</TD></TR>
          )}
        </TBody>
      </Table>
    </div>
  );
}
