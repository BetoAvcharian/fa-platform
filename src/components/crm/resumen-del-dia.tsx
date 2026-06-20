"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { diasDesde } from "@/lib/utils";
import { PhoneCall, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface ClienteRow {
  id: string;
  nombre: string;
  apellido: string | null;
  fecha_ultimo_contacto: string | null;
}

export function ResumenDelDia({ clientes }: { clientes: ClienteRow[] }) {
  const [search, setSearch] = useState("");
  const [hoyContactados, setHoyContactados] = useState<Set<string>>(new Set());
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [tareaAbierta, setTareaAbierta] = useState<Set<string>>(new Set());
  const [tareaFecha, setTareaFecha] = useState<Record<string, string>>({});
  const [tareaTitulo, setTareaTitulo] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const filtrados = useMemo(() => {
    return clientes
      .filter((c) => `${c.nombre} ${c.apellido ?? ""}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (diasDesde(b.fecha_ultimo_contacto) ?? 9999) - (diasDesde(a.fecha_ultimo_contacto) ?? 9999));
  }, [clientes, search]);

  function toggleTarea(id: string) {
    setTareaAbierta((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function registrarContacto(clienteId: string) {
    setGuardando(clienteId);
    const { data: { user } } = await supabase.auth.getUser();
    const hoy = new Date().toISOString().slice(0, 10);
    const nota = notas[clienteId]?.trim() || null;

    const { error: e1 } = await supabase.from("interacciones").insert({
      cliente_id: clienteId,
      usuario_id: user?.id,
      tipo: "llamada",
      asunto: "Contacto diario",
      detalle: nota,
      fecha: new Date().toISOString(),
    });
    const { error: e2 } = await supabase.from("clientes").update({ fecha_ultimo_contacto: hoy }).eq("id", clienteId);

    let errorTarea = null;
    const fecha = tareaFecha[clienteId];
    const titulo = tareaTitulo[clienteId];
    if (fecha && titulo) {
      const { error } = await supabase.from("tareas").insert({
        owner_id: user?.id,
        cliente_id: clienteId,
        titulo,
        descripcion: nota,
        prioridad: "media",
        fecha_vencimiento: fecha,
        estado: "pendiente",
      });
      errorTarea = error;
    }

    setGuardando(null);
    if (e1 || e2 || errorTarea) {
      toast.error("Error al registrar el contacto");
      return;
    }
    setHoyContactados((prev) => new Set(prev).add(clienteId));
    toast.success(fecha && titulo ? "Contacto registrado y tarea creada" : "Contacto registrado");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del día — ¿con quién hablaste?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="max-h-[32rem] space-y-2 overflow-y-auto">
          {filtrados.map((c) => {
            const yaContactado = hoyContactados.has(c.id) || diasDesde(c.fecha_ultimo_contacto) === 0;
            const tareaVisible = tareaAbierta.has(c.id);
            return (
              <div key={c.id} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{c.nombre} {c.apellido}</p>
                    <p className="text-xs text-muted-foreground">
                      Último contacto: {diasDesde(c.fecha_ultimo_contacto) ?? "—"} días
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={yaContactado ? "subtle" : "outline"}
                    disabled={yaContactado || guardando === c.id}
                    onClick={() => registrarContacto(c.id)}
                  >
                    {yaContactado ? <><Check className="h-3.5 w-3.5" /> Contactado hoy</> : guardando === c.id ? "Guardando..." : <><PhoneCall className="h-3.5 w-3.5" /> Contactado hoy</>}
                  </Button>
                </div>

                {!yaContactado && (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      rows={2}
                      placeholder="Nota: ej. está por vender un depto, llamó por dudas de su cartera..."
                      value={notas[c.id] ?? ""}
                      onChange={(e) => setNotas((prev) => ({ ...prev, [c.id]: e.target.value }))}
                      className="text-sm"
                    />

                    {!tareaVisible ? (
                      <button
                        onClick={() => toggleTarea(c.id)}
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Crear tarea de seguimiento
                      </button>
                    ) : (
                      <div className="space-y-2 rounded-md bg-muted p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Tarea de seguimiento</span>
                          <button onClick={() => toggleTarea(c.id)} className="text-muted-foreground hover:text-foreground">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Input
                          placeholder="Título (ej: Consultar si vendió el depto)"
                          value={tareaTitulo[c.id] ?? ""}
                          onChange={(e) => setTareaTitulo((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          className="h-8 text-sm"
                        />
                        <Input
                          type="date"
                          value={tareaFecha[c.id] ?? ""}
                          onChange={(e) => setTareaFecha((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {filtrados.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Sin resultados.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
