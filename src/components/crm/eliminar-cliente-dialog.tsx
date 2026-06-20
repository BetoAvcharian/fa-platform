"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function EliminarClienteDialog({ clienteId, nombre }: { clienteId: string; nombre: string }) {
  const [open, setOpen] = useState(false);
  const [confirmacion, setConfirmacion] = useState("");
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
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setConfirmacion(""); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /> Eliminar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Eliminar a {nombre}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Esto borra el cliente y todo lo asociado (cuentas, tareas, interacciones, documentos). No se puede deshacer.
            Escribí <strong>ELIMINAR</strong> para confirmar.
          </p>
          <Input value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} placeholder="ELIMINAR" />
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="destructive" disabled={confirmacion !== "ELIMINAR" || eliminando} onClick={handleEliminar}>
              {eliminando ? "Eliminando..." : "Eliminar definitivamente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
