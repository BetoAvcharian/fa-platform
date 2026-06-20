"use client";

import { useRouter } from "next/navigation";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { SelectNative } from "@/components/ui/select-native";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
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

export function UsuariosTable({ usuarios }: { usuarios: UsuarioRow[] }) {
  const router = useRouter();
  const supabase = createClient();

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

  return (
    <Table>
      <THead>
        <TR><TH>Usuario</TH><TH>Email</TH><TH>Rol</TH><TH>Manager / Equipo</TH><TH>Estado</TH></TR>
      </THead>
      <TBody>
        {usuarios.map((u) => (
          <TR key={u.id}>
            <TD>{u.nombre} {u.apellido}</TD>
            <TD className="text-muted-foreground">{u.email}</TD>
            <TD>
              <SelectNative value={u.rol} onChange={(e) => cambiarRol(u.id, e.target.value)} className="h-8 w-32">
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
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
