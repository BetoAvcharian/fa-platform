"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SelectNative } from "@/components/ui/select-native";
import { createClient } from "@/lib/supabase/client";
import { formatUSD } from "@/lib/utils";
import { Home, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface HogarOption { id: string; nombre: string }
interface MiembroHogar { id: string; nombre: string; apellido: string | null; potencial: number }

export function HogarWidget({
  clienteId,
  hogarActualId,
  hogarNombre,
  hogaresDisponibles,
  miembros,
}: {
  clienteId: string;
  hogarActualId: string | null;
  hogarNombre: string | null;
  hogaresDisponibles: HogarOption[];
  miembros: MiembroHogar[];
}) {
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<"existente" | "nuevo">("existente");
  const [hogarSeleccionado, setHogarSeleccionado] = useState("");
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const totalPotencial = miembros.reduce((s, m) => s + m.potencial, 0);

  async function asignar() {
    setGuardando(true);
    let hogarId = hogarSeleccionado;

    if (modo === "nuevo") {
      if (!nombreNuevo.trim()) {
        toast.error("Poné un nombre para el hogar");
        setGuardando(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("hogares").insert({ nombre: nombreNuevo, owner_id: user?.id }).select("id").single();
      if (error || !data) {
        toast.error("Error creando el hogar: " + (error?.message ?? ""));
        setGuardando(false);
        return;
      }
      hogarId = data.id;
    }

    if (!hogarId) {
      toast.error("Elegí un hogar");
      setGuardando(false);
      return;
    }

    const { error } = await supabase.from("clientes").update({ hogar_id: hogarId }).eq("id", clienteId);
    setGuardando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Hogar asignado");
    setOpen(false);
    router.refresh();
  }

  async function quitar() {
    const { error } = await supabase.from("clientes").update({ hogar_id: null }).eq("id", clienteId);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Quitado del hogar");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2"><Home className="h-3.5 w-3.5" /> Hogar</CardTitle>
        {hogarActualId && (
          <button onClick={quitar} className="text-xs text-muted-foreground hover:text-danger">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {hogarActualId ? (
          <>
            <p className="text-sm font-medium">{hogarNombre}</p>
            <p className="text-xs text-muted-foreground">Potencial combinado del hogar: {formatUSD(totalPotencial)}</p>
            <div className="space-y-1">
              {miembros.filter((m) => m.id !== clienteId).map((m) => (
                <Link key={m.id} href={`/clientes/${m.id}`} className="block text-sm text-accent hover:underline">
                  {m.nombre} {m.apellido}
                </Link>
              ))}
              {miembros.length <= 1 && <p className="text-xs text-muted-foreground">Sin otros miembros todavía.</p>}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Sin hogar asignado.</p>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5" /> {hogarActualId ? "Cambiar" : "Asignar"} hogar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Asignar a un hogar</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={modo === "existente" ? "default" : "outline"} onClick={() => setModo("existente")}>Hogar existente</Button>
                <Button type="button" size="sm" variant={modo === "nuevo" ? "default" : "outline"} onClick={() => setModo("nuevo")}>Hogar nuevo</Button>
              </div>
              {modo === "existente" ? (
                <SelectNative value={hogarSeleccionado} onChange={(e) => setHogarSeleccionado(e.target.value)}>
                  <option value="">Elegir...</option>
                  {hogaresDisponibles.map((h) => <option key={h.id} value={h.id}>{h.nombre}</option>)}
                </SelectNative>
              ) : (
                <Input value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)} placeholder="Ej: Familia Gifuni" />
              )}
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="button" disabled={guardando} onClick={asignar}>{guardando ? "Guardando..." : "Asignar"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
