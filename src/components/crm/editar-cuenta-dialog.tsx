"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { createClient } from "@/lib/supabase/client";
import { PLAZAS, type PlazaTipo } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CuentaActual {
  id: string;
  numero_cuenta: string;
  tipo_cuenta: string | null;
  plaza: PlazaTipo;
  estado_cuenta: "activa" | "inactiva" | "cerrada";
}

export function EditarCuentaDialog({ cuenta }: { cuenta: CuentaActual }) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [numeroCuenta, setNumeroCuenta] = useState(cuenta.numero_cuenta);
  const [tipoCuenta, setTipoCuenta] = useState(cuenta.tipo_cuenta ?? "");
  const [plaza, setPlaza] = useState<PlazaTipo>(cuenta.plaza);
  const [estadoCuenta, setEstadoCuenta] = useState(cuenta.estado_cuenta);
  const router = useRouter();
  const supabase = createClient();

  async function handleEliminar() {
    setEliminando(true);
    const { error } = await supabase.from("cuentas").delete().eq("id", cuenta.id);
    setEliminando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Cuenta eliminada");
    setOpen(false);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!numeroCuenta) {
      toast.error("El número de comitente es obligatorio");
      return;
    }
    setGuardando(true);
    const { error } = await supabase
      .from("cuentas")
      .update({ numero_cuenta: numeroCuenta, tipo_cuenta: tipoCuenta || null, plaza, estado_cuenta: estadoCuenta })
      .eq("id", cuenta.id);
    setGuardando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Cuenta actualizada");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Editar cuenta</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Número de comitente *</label>
            <Input required value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tipo de cuenta</label>
            <Input value={tipoCuenta} onChange={(e) => setTipoCuenta(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Plaza / Custodio</label>
            <SelectNative value={plaza} onChange={(e) => setPlaza(e.target.value as PlazaTipo)}>
              {PLAZAS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
            </SelectNative>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Estado</label>
            <SelectNative value={estadoCuenta} onChange={(e) => setEstadoCuenta(e.target.value as any)}>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
              <option value="cerrada">Cerrada</option>
            </SelectNative>
          </div>
          {!confirmarBorrado ? (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <Button type="button" variant="ghost" onClick={() => setConfirmarBorrado(true)} className="text-danger">
                <Trash2 className="h-3.5 w-3.5" /> Eliminar cuenta
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Guardar cambios"}</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 rounded-md bg-danger/10 p-3">
              <p className="text-sm">¿Seguro que querés eliminar esta cuenta? No se puede deshacer.</p>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setConfirmarBorrado(false)}>Cancelar</Button>
                <Button type="button" variant="destructive" size="sm" disabled={eliminando} onClick={handleEliminar}>
                  {eliminando ? "Eliminando..." : "Sí, eliminar"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
