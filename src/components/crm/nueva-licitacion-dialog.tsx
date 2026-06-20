"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function NuevaLicitacionDialog() {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    instrumento: "",
    fecha_licitacion: "",
    fecha_liquidacion: "",
    moneda_base: "USD",
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
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("licitaciones")
      .insert({ ...form, owner_id: user?.id })
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4" /> Nueva licitación</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nueva licitación</DialogTitle></DialogHeader>
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
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Moneda base</label>
            <SelectNative value={form.moneda_base} onChange={(e) => setForm((f) => ({ ...f, moneda_base: e.target.value }))}>
              <option value="USD">USD</option>
              <option value="USDC">USDC</option>
              <option value="PESOS">PESOS</option>
            </SelectNative>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Creando..." : "Crear y abrir"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
