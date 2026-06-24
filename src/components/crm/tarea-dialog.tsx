"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { ClienteMultiCombobox } from "@/components/crm/cliente-multi-combobox";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Tarea } from "@/lib/types";

interface ClienteOption { id: string; nombre: string; apellido: string | null }

export function TareaDialog({
  clientes,
  tarea,
  clienteIdsIniciales,
  fechaInicial,
  trigger,
  open: openControlado,
  onOpenChange: onOpenChangeControlado,
}: {
  clientes: ClienteOption[];
  tarea?: Tarea;
  clienteIdsIniciales?: string[];
  fechaInicial?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [openInterno, setOpenInterno] = useState(false);
  const open = openControlado ?? openInterno;
  const setOpen = onOpenChangeControlado ?? setOpenInterno;

  const [guardando, setGuardando] = useState(false);

  const estadoInicial = {
    titulo: tarea?.titulo ?? "",
    descripcion: tarea?.descripcion ?? "",
    clienteIds: clienteIdsIniciales ?? [],
    prioridad: tarea?.prioridad ?? "media",
    fecha_vencimiento: tarea?.fecha_vencimiento ?? fechaInicial ?? "",
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
      prioridad: form.prioridad,
      fecha_vencimiento: form.fecha_vencimiento || null,
      estado: form.estado,
    };

    let tareaId = tarea?.id;
    let error;

    if (tarea) {
      ({ error } = await supabase.from("tareas").update(payload).eq("id", tarea.id));
    } else {
      const { data, error: errorInsert } = await supabase
        .from("tareas")
        .insert({ ...payload, owner_id: user?.id })
        .select("id")
        .single();
      error = errorInsert;
      tareaId = data?.id;
    }

    if (!error && tareaId) {
      // reescribe los vínculos con clientes (borra los viejos y pone los nuevos elegidos)
      await supabase.from("tarea_clientes").delete().eq("tarea_id", tareaId);
      if (form.clienteIds.length > 0) {
        await supabase.from("tarea_clientes").insert(form.clienteIds.map((cliente_id) => ({ tarea_id: tareaId, cliente_id })));
      }
    }

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
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button size="sm">
              <Plus className="h-4 w-4" /> Nueva tarea
            </Button>
          )}
        </DialogTrigger>
      )}
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
            <label className="text-xs font-medium text-muted-foreground">Clientes (opcional, podés elegir varios)</label>
            <ClienteMultiCombobox
              clientes={clientes}
              value={form.clienteIds}
              onChange={(ids) => setForm((f) => ({ ...f, clienteIds: ids }))}
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
