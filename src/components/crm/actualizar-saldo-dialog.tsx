"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

export function ActualizarSaldoDialog({ numeroCuenta, aumActual }: { numeroCuenta: string; aumActual: number }) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [aum, setAum] = useState(String(aumActual ?? 0));
  const [cash, setCash] = useState("0");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    // siempre INSERT, nunca update -> mantiene el histórico completo
    const { error } = await supabase.from("patrimonio").insert({
      fecha_carga: fecha,
      numero_cuenta: numeroCuenta,
      aum: Number(aum) || 0,
      cash: Number(cash) || 0,
    });
    setGuardando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Saldo actualizado");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Wallet className="h-3.5 w-3.5" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Actualizar saldo — {numeroCuenta}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Esto agrega un punto nuevo al histórico de patrimonio para esta cuenta — no pisa lo que ya tenías cargado.
          </p>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Fecha</label>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">AUM</label>
              <Input type="number" value={aum} onChange={(e) => setAum(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Cash</label>
              <Input type="number" value={cash} onChange={(e) => setCash(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
