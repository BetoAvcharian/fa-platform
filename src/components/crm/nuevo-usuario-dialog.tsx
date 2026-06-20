"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ManagerOption { id: string; nombre: string; apellido: string }

export function NuevoUsuarioDialog({ managers }: { managers: ManagerOption[] }) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", rol: "fa", manager_id: "" });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setGuardando(false);

    if (!res.ok) {
      toast.error(data.error ?? "Error al crear usuario");
      return;
    }
    toast.success("Usuario creado");
    setForm({ nombre: "", apellido: "", email: "", password: "", rol: "fa", manager_id: "" });
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4" /> Nuevo usuario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Crear usuario</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nombre</label>
              <Input required value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Apellido</label>
              <Input required value={form.apellido} onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <Input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
            <Input type="password" required minLength={6} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Rol</label>
              <SelectNative value={form.rol} onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}>
                <option value="fa">FA</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </SelectNative>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Manager / Equipo</label>
              <SelectNative value={form.manager_id} onChange={(e) => setForm((f) => ({ ...f, manager_id: e.target.value }))}>
                <option value="">Sin equipo</option>
                {managers.map((m) => <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>)}
              </SelectNative>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Creando..." : "Crear usuario"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
