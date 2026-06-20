"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { createClient } from "@/lib/supabase/client";
import { PLAZAS, type PlazaTipo } from "@/lib/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AgregarCuentaDialog({ clienteId }: { clienteId: string }) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [plaza, setPlaza] = useState<PlazaTipo>("local");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!numeroCuenta) {
      toast.error("El número de comitente es obligatorio");
      return;
    }
    setGuardando(true);
    const { data: cuentaCreada, error } = await supabase
      .from("cuentas")
      .insert({
        numero_cuenta: numeroCuenta,
        tipo_cuenta: tipoCuenta || null,
        plaza,
        estado_cuenta: "activa",
      })
      .select("id")
      .single();

    if (error || !cuentaCreada) {
      setGuardando(false);
      toast.error("Error: " + (error?.message ?? "no se pudo crear la cuenta"));
      return;
    }

    const { error: errorTitular } = await supabase
      .from("cuenta_titulares")
      .insert({ cuenta_id: cuentaCreada.id, cliente_id: clienteId, rol_titular: "titular" });

    setGuardando(false);
    if (errorTitular) {
      toast.error("Error vinculando titular: " + errorTitular.message);
      return;
    }
    toast.success("Cuenta agregada");
    setNumeroCuenta("");
    setTipoCuenta("");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="h-4 w-4" /> Agregar cuenta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Agregar cuenta</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Número de comitente *</label>
            <Input required value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tipo de cuenta</label>
            <Input value={tipoCuenta} onChange={(e) => setTipoCuenta(e.target.value)} placeholder="Ej: Cuenta Comitente" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Plaza / Custodio</label>
            <SelectNative value={plaza} onChange={(e) => setPlaza(e.target.value as PlazaTipo)}>
              {PLAZAS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
            </SelectNative>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Agregar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
