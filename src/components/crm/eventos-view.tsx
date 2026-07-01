"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventoDialog } from "@/components/crm/evento-dialog";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";

const TIPO_TONE: Record<string, "default" | "accent" | "success" | "warning"> = {
  networking: "accent",
  conferencia: "warning",
  cena: "success",
  reunion: "default",
  otro: "default",
};

interface Evento {
  id: string;
  titulo: string;
  tipo: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  lugar: string | null;
  descripcion: string | null;
  invitado_por: string | null;
  link_inscripcion: string | null;
  confirmado: boolean;
}

export function EventosView({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [mesActual, setMesActual] = useState(new Date());

  const hoy = new Date().toISOString().slice(0, 10);
  const proximos = eventos.filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pasados = eventos.filter((e) => e.fecha < hoy).sort((a, b) => b.fecha.localeCompare(a.fecha));

  async function eliminar(id: string) {
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) { toast.error("Error: " + error.message); return; }
    toast.success("Evento eliminado");
    router.refresh();
  }

  async function toggleConfirmado(id: string, actual: boolean) {
    await supabase.from("eventos").update({ confirmado: !actual }).eq("id", id);
    router.refresh();
  }

  const diasDelMes = useMemo(() => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const inicioGrid = new Date(primerDia);
    inicioGrid.setDate(inicioGrid.getDate() - ((primerDia.getDay() + 6) % 7));
    const dias: Date[] = [];
    const cursor = new Date(inicioGrid);
    while (cursor <= ultimoDia || dias.length % 7 !== 0) {
      dias.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
      if (dias.length > 42) break;
    }
    return dias;
  }, [mesActual]);

  function eventosDelDia(d: Date) {
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
    const key = `${y}-${m}-${day}`;
    return eventos.filter((e) => e.fecha === key);
  }

  function EventoCard({ e }: { e: Evento }) {
    return (
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{e.titulo}</p>
                <Badge variant={TIPO_TONE[e.tipo] ?? "default"} className="capitalize">{e.tipo}</Badge>
                {e.confirmado && <Badge variant="success"><Check className="h-3 w-3 mr-1" />Confirmado</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                📅 {e.fecha}{e.hora_inicio ? ` · ${e.hora_inicio}${e.hora_fin ? ` - ${e.hora_fin}` : ""}` : ""}
                {e.lugar ? ` · 📍 ${e.lugar}` : ""}
              </p>
              {e.invitado_por && <p className="text-xs text-muted-foreground">Invitado por: {e.invitado_por}</p>}
              {e.descripcion && <p className="text-xs text-muted-foreground">{e.descripcion}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              {e.link_inscripcion && (
                <a href={e.link_inscripcion} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="ghost"><ExternalLink className="h-3.5 w-3.5" /></Button>
                </a>
              )}
              <Button size="icon" variant="ghost" onClick={() => toggleConfirmado(e.id, e.confirmado)}>
                <Check className={`h-3.5 w-3.5 ${e.confirmado ? "text-success" : "text-muted-foreground"}`} />
              </Button>
              <EventoDialog evento={e} trigger={<Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>} />
              <Button size="icon" variant="ghost" onClick={() => eliminar(e.id)}>
                <Trash2 className="h-3.5 w-3.5 text-danger" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="proximos">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="proximos">Próximos ({proximos.length})</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="pasados">Pasados ({pasados.length})</TabsTrigger>
        </TabsList>
        <EventoDialog />
      </div>

      <TabsContent value="proximos" className="space-y-2 mt-4">
        {proximos.map((e) => <EventoCard key={e.id} e={e} />)}
        {proximos.length === 0 && <p className="py-12 text-center text-muted-foreground">Sin eventos próximos. Creá uno con el botón de arriba.</p>}
      </TabsContent>

      <TabsContent value="calendario" className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))}>←</Button>
          <span className="text-sm font-medium capitalize">{mesActual.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}</span>
          <Button variant="outline" size="sm" onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))}>→</Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {diasDelMes.map((d, i) => {
            const enMes = d.getMonth() === mesActual.getMonth();
            const items = eventosDelDia(d);
            return (
              <div key={i} className={`min-h-[80px] rounded-md border border-border p-1.5 text-xs ${enMes ? "" : "opacity-30"}`}>
                <p className="font-medium mb-1">{d.getDate()}</p>
                {items.map((e) => (
                  <p key={e.id} className={`truncate rounded px-1 py-0.5 mb-0.5 ${e.confirmado ? "bg-success/20 text-success" : "bg-accent/15 text-accent"}`}>
                    {e.titulo}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="pasados" className="space-y-2 mt-4">
        {pasados.map((e) => <EventoCard key={e.id} e={e} />)}
        {pasados.length === 0 && <p className="py-12 text-center text-muted-foreground">Sin eventos pasados.</p>}
      </TabsContent>
    </Tabs>
  );
}
