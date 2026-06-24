"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { Licitacion } from "@/lib/types";

export function NuevaLicitacionDialog({ licitacion }: { licitacion?: Licitacion }) {
  const esEdicion = !!licitacion;
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: licitacion?.nombre ?? "",
    instrumento: licitacion?.instrumento ?? "",
    fecha_licitacion: licitacion?.fecha_licitacion ?? "",
    fecha_liquidacion: licitacion?.fecha_liquidacion ?? "",
    moneda_base: licitacion?.moneda_base ?? "USD",
    arancel_pct: licitacion?.arancel_pct ? String(licitacion.arancel_pct) : "",
  });
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setGuardando(true);

    const payload = { ...form, arancel_pct: form.arancel_pct ? Number(form.arancel_pct) : null };

    if (esEdicion) {
      const { error } = await supabase.from("licitaciones").update(payload).eq("id", licitacion!.id);
      setGuardando(false);
      if (error) {
        toast.error("Error: " + error.message);
        return;
      }
      toast.success("Licitación actualizada");
      setOpen(false);
      router.refresh();
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("licitaciones")
        .insert({ ...payload, owner_id: user?.id })
        .select()
        .single();
      setGuardando(false);
      if (error) {
        toast.error("Error: " + error.message);
        return;
      }
      toast.success("Licitación creada");
      setOpen(false);
      router.push(`/licitaciones/${data.id}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {esEdicion ? (
          <Button size="sm" variant="outline"><Pencil className="h-4 w-4" /> Editar</Button>
        ) : (
          <Button size="sm"><Plus className="h-4 w-4" /> Nueva licitación</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{esEdicion ? "Editar licitación" : "Nueva licitación"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Nombre *</label>
            <Input required value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Licitación ON Balanz Julio 2026" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Instrumento</label>
            <Input value={form.instrumento} onChange={(e) => setForm((f) => ({ ...f, instrumento: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Fecha licitación</label>
              <Input type="date" value={form.fecha_licitacion} onChange={(e) => setForm((f) => ({ ...f, fecha_licitacion: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Fecha liquidación</label>
              <Input type="date" value={form.fecha_liquidacion} onChange={(e) => setForm((f) => ({ ...f, fecha_liquidacion: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Moneda base</label>
              <SelectNative value={form.moneda_base} onChange={(e) => setForm((f) => ({ ...f, moneda_base: e.target.value }))}>
                <option value="USD">USD</option>
                <option value="USDC">USDC</option>
                <option value="PESOS">PESOS</option>
              </SelectNative>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Arancel %</label>
              <Input
                type="number"
                step="0.01"
                value={form.arancel_pct}
                onChange={(e) => setForm((f) => ({ ...f, arancel_pct: e.target.value }))}
                placeholder="Ej: 1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear y abrir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
