"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

const TIPOS = ["networking", "conferencia", "cena", "reunion", "otro"];

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

export function EventoDialog({
  evento,
  trigger,
}: {
  evento?: Evento;
  trigger?: React.ReactNode;
}) {
  const esEdicion = !!evento;
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    tipo: "networking",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    lugar: "",
    descripcion: "",
    invitado_por: "",
    link_inscripcion: "",
    confirmado: false,
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (open) {
      setForm({
        titulo: evento?.titulo ?? "",
        tipo: evento?.tipo ?? "networking",
        fecha: evento?.fecha ?? "",
        hora_inicio: evento?.hora_inicio ?? "",
        hora_fin: evento?.hora_fin ?? "",
        lugar: evento?.lugar ?? "",
        descripcion: evento?.descripcion ?? "",
        invitado_por: evento?.invitado_por ?? "",
        link_inscripcion: evento?.link_inscripcion ?? "",
        confirmado: evento?.confirmado ?? false,
      });
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo || !form.fecha) {
      toast.error("Título y fecha son obligatorios");
      return;
    }
    setGuardando(true);

    const payload = {
      titulo: form.titulo,
      tipo: form.tipo,
      fecha: form.fecha,
      hora_inicio: form.hora_inicio || null,
      hora_fin: form.hora_fin || null,
      lugar: form.lugar || null,
      descripcion: form.descripcion || null,
      invitado_por: form.invitado_por || null,
      link_inscripcion: form.link_inscripcion || null,
      confirmado: form.confirmado,
    };

    if (esEdicion) {
      const { error } = await supabase.from("eventos").update(payload).eq("id", evento!.id);
      setGuardando(false);
      if (error) { toast.error("Error: " + error.message); return; }
      toast.success("Evento actualizado");
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("eventos").insert({ ...payload, owner_id: user?.id });
      setGuardando(false);
      if (error) { toast.error("Error: " + error.message); return; }
      toast.success("Evento creado");
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm"><Plus className="h-4 w-4" /> Nuevo evento</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{esEdicion ? "Editar evento" : "Nuevo evento"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Título *</label>
            <Input required value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} placeholder="Ej: Congreso ASAPRA, Cena de clientes..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tipo</label>
              <SelectNative value={form.tipo} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}>
                {TIPOS.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </SelectNative>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Fecha *</label>
              <Input type="date" required value={form.fecha} onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Hora inicio</label>
              <Input type="time" value={form.hora_inicio} onChange={(e) => setForm((f) => ({ ...f, hora_inicio: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Hora fin</label>
              <Input type="time" value={form.hora_fin} onChange={(e) => setForm((f) => ({ ...f, hora_fin: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Lugar</label>
            <Input value={form.lugar} onChange={(e) => setForm((f) => ({ ...f, lugar: e.target.value }))} placeholder="Dirección o nombre del lugar" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Quién nos invitó</label>
            <Input value={form.invitado_por} onChange={(e) => setForm((f) => ({ ...f, invitado_por: e.target.value }))} placeholder="Nombre o empresa" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Link de inscripción</label>
            <Input type="url" value={form.link_inscripcion} onChange={(e) => setForm((f) => ({ ...f, link_inscripcion: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Notas</label>
            <Textarea rows={2} value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.confirmado} onChange={(e) => setForm((f) => ({ ...f, confirmado: e.target.checked }))} />
            Confirmado / inscripto
          </label>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear evento"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
