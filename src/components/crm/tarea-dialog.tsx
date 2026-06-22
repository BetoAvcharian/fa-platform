"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { ClienteCombobox } from "@/components/crm/cliente-combobox";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Tarea } from "@/lib/types";

interface ClienteOption { id: string; nombre: string; apellido: string | null }

export function TareaDialog({
  clientes,
  tarea,
  trigger,
}: {
  clientes: ClienteOption[];
  tarea?: Tarea;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const estadoInicial = {
    titulo: tarea?.titulo ?? "",
    descripcion: tarea?.descripcion ?? "",
    cliente_id: tarea?.cliente_id ?? "",
    prioridad: tarea?.prioridad ?? "media",
    fecha_vencimiento: tarea?.fecha_vencimiento ?? "",
    estado: tarea?.estado ?? "pendiente",
  };

  const [form, setForm] = useState(estadoInicial);
  const router = useRouter();
  const supabase = createClient();

  function handleOpenChange(nuevoEstado: boolean) {
    setOpen(nuevoEstado);
    if (nuevoEstado) {
      // al abrir, siempre arranca limpio (si es "Nueva tarea") o con los datos actuales (si es editar)
      setForm(estadoInicial);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo) {
      toast.error("El título es obligatorio");
      return;
    }
    setGuardando(true);

    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      cliente_id: form.cliente_id || null,
      prioridad: form.prioridad,
      fecha_vencimiento: form.fecha_vencimiento || null,
      estado: form.estado,
    };

    const { error } = tarea
      ? await supabase.from("tareas").update(payload).eq("id", tarea.id)
      : await supabase.from("tareas").insert({ ...payload, owner_id: user?.id });

    setGuardando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success(tarea ? "Tarea actualizada" : "Tarea creada");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nueva tarea
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tarea ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Título *</label>
            <Input required value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Descripción</label>
            <Textarea rows={2} value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Cliente (opcional)</label>
            <ClienteCombobox
              clientes={clientes}
              value={form.cliente_id ?? ""}
              onChange={(id) => setForm((f) => ({ ...f, cliente_id: id }))}
              placeholder="Sin cliente asociado"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Prioridad</label>
              <SelectNative value={form.prioridad} onChange={(e) => setForm((f) => ({ ...f, prioridad: e.target.value as any }))}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </SelectNative>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Vencimiento</label>
              <Input type="date" value={form.fecha_vencimiento ?? ""} onChange={(e) => setForm((f) => ({ ...f, fecha_vencimiento: e.target.value }))} />
            </div>
          </div>
          {tarea && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Estado</label>
              <SelectNative value={form.estado} onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value as any }))}>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completada">Completada</option>
              </SelectNative>
            </div>
          )}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Guardando..." : tarea ? "Guardar" : "Crear tarea"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
