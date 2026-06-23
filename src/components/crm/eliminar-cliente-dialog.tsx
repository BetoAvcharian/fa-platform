"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function EliminarClienteDialog({ clienteId, nombre }: { clienteId: string; nombre: string }) {
  const [open, setOpen] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleEliminar() {
    setEliminando(true);
    const { error } = await supabase.from("clientes").delete().eq("id", clienteId);
    setEliminando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Cliente eliminado");
    setOpen(false);
    router.push("/clientes");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setConfirmando(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /> Eliminar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Eliminar a {nombre}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Esto borra el cliente y todo lo asociado (cuentas, tareas, interacciones, documentos). No se puede deshacer.
          </p>
          {!confirmando ? (
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => setConfirmando(true)}>Eliminar</Button>
            </div>
          ) : (
            <div className="space-y-2 rounded-md bg-danger/10 p-3">
              <p className="text-sm font-medium">¿Confirmás que querés eliminarlo definitivamente?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirmando(false)}>Cancelar</Button>
                <Button variant="destructive" size="sm" disabled={eliminando} onClick={handleEliminar}>
                  {eliminando ? "Eliminando..." : "Sí, eliminar"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
