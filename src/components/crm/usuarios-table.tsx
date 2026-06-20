"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { SelectNative } from "@/components/ui/select-native";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UsuarioRow {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "admin" | "manager" | "fa";
  manager_id: string | null;
  estado: "activo" | "inactivo";
}

export function UsuariosTable({ usuarios, miPropioId }: { usuarios: UsuarioRow[]; miPropioId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [paraEliminar, setParaEliminar] = useState<{ id: string; nombre: string } | null>(null);
  const [confirmacion, setConfirmacion] = useState("");
  const [eliminando, setEliminando] = useState(false);

  const managers = usuarios.filter((u) => u.rol === "manager" || u.rol === "admin");

  async function cambiarRol(id: string, rol: string) {
    const { error } = await supabase.from("usuarios").update({ rol }).eq("id", id);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Rol actualizado");
    router.refresh();
  }

  async function cambiarManager(id: string, managerId: string) {
    const { error } = await supabase.from("usuarios").update({ manager_id: managerId || null }).eq("id", id);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Equipo actualizado");
    router.refresh();
  }

  async function cambiarEstado(id: string, estado: string) {
    const { error } = await supabase.from("usuarios").update({ estado }).eq("id", id);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Estado actualizado");
    router.refresh();
  }

  async function confirmarEliminar() {
    if (!paraEliminar) return;
    setEliminando(true);
    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: paraEliminar.id }),
    });
    const data = await res.json();
    setEliminando(false);
    if (!res.ok) {
      toast.error(data.error ?? "Error al eliminar");
      return;
    }
    toast.success("Usuario eliminado");
    setParaEliminar(null);
    setConfirmacion("");
    router.refresh();
  }

  return (
    <>
      <Table>
        <THead>
          <TR><TH>Usuario</TH><TH>Email</TH><TH>Rol</TH><TH>Manager / Equipo</TH><TH>Estado</TH><TH></TH></TR>
        </THead>
        <TBody>
          {usuarios.map((u) => {
            const esUnoMismo = u.id === miPropioId;
            return (
              <TR key={u.id}>
                <TD>{u.nombre} {u.apellido} {esUnoMismo && <span className="text-xs text-muted-foreground">(vos)</span>}</TD>
                <TD className="text-muted-foreground">{u.email}</TD>
                <TD>
                  <SelectNative value={u.rol} onChange={(e) => cambiarRol(u.id, e.target.value)} className="h-8 w-32" disabled={esUnoMismo}>
                    <option value="fa">FA</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </SelectNative>
                </TD>
                <TD>
                  <SelectNative
                    value={u.manager_id ?? ""}
                    onChange={(e) => cambiarManager(u.id, e.target.value)}
                    className="h-8 w-44"
                    disabled={u.rol === "admin"}
                  >
                    <option value="">Sin equipo</option>
                    {managers.filter((m) => m.id !== u.id).map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
                    ))}
                  </SelectNative>
                </TD>
                <TD>
                  <SelectNative value={u.estado} onChange={(e) => cambiarEstado(u.id, e.target.value)} className="h-8 w-28">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </SelectNative>
                </TD>
                <TD>
                  {!esUnoMismo && (
                    <Button size="icon" variant="ghost" onClick={() => setParaEliminar({ id: u.id, nombre: `${u.nombre} ${u.apellido}` })}>
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  )}
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>

      <Dialog open={!!paraEliminar} onOpenChange={(o) => { if (!o) { setParaEliminar(null); setConfirmacion(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Eliminar a {paraEliminar?.nombre}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Esto borra el acceso de esta persona definitivamente, no se puede deshacer. Escribí <strong>ELIMINAR</strong> para confirmar.
            </p>
            <Input value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} placeholder="ELIMINAR" />
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" onClick={() => { setParaEliminar(null); setConfirmacion(""); }}>Cancelar</Button>
              <Button variant="destructive" disabled={confirmacion !== "ELIMINAR" || eliminando} onClick={confirmarEliminar}>
                {eliminando ? "Eliminando..." : "Eliminar definitivamente"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
