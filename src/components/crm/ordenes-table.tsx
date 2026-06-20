"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatUSD } from "@/lib/utils";
import { ESTADOS_ORDEN, MONEDAS, type LicitacionOrden, type LicitacionEstadoOrden, type MonedaTipo } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type OrdenRow = LicitacionOrden & { cliente_nombre?: string };
interface ClienteOption { id: string; nombre: string; apellido: string | null }

const ESTADO_TONE: Record<LicitacionEstadoOrden, "default" | "success" | "warning" | "danger" | "accent"> = {
  tentativo: "default",
  confirmada: "success",
  cargada: "accent",
  cancelada: "danger",
};

export function OrdenesTable({
  licitacionId,
  ordenes,
  clientes,
  monedaBase,
}: {
  licitacionId: string;
  ordenes: OrdenRow[];
  clientes: ClienteOption[];
  monedaBase: MonedaTipo;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [nueva, setNueva] = useState({ cliente_id: "", monto: "", moneda: monedaBase, comentario: "" });
  const [guardando, setGuardando] = useState(false);

  async function agregarOrden() {
    if (!nueva.cliente_id || !nueva.monto) {
      toast.error("Elegí un cliente y un monto");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("licitacion_ordenes").insert({
      licitacion_id: licitacionId,
      cliente_id: nueva.cliente_id,
      monto: Number(nueva.monto),
      moneda: nueva.moneda,
      comentario: nueva.comentario || null,
      estado: "tentativo",
    });
    setGuardando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    setNueva({ cliente_id: "", monto: "", moneda: monedaBase, comentario: "" });
    router.refresh();
  }

  async function actualizarEstado(id: string, estado: LicitacionEstadoOrden) {
    await supabase.from("licitacion_ordenes").update({ estado }).eq("id", id);
    router.refresh();
  }

  async function actualizarComentario(id: string, comentario: string) {
    await supabase.from("licitacion_ordenes").update({ comentario }).eq("id", id);
  }

  async function eliminar(id: string) {
    await supabase.from("licitacion_ordenes").delete().eq("id", id);
    router.refresh();
  }

  const totalPorMoneda = ordenes.reduce<Record<string, number>>((acc, o) => {
    acc[o.moneda] = (acc[o.moneda] ?? 0) + Number(o.monto);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Table>
        <THead>
          <TR><TH>Cliente</TH><TH>Monto</TH><TH>Moneda</TH><TH>Estado</TH><TH>Comentario</TH><TH></TH></TR>
        </THead>
        <TBody>
          {ordenes.map((o) => (
            <TR key={o.id}>
              <TD>{o.cliente_nombre}</TD>
              <TD className="tabular">{formatUSD(o.monto)}</TD>
              <TD>{o.moneda}</TD>
              <TD>
                <SelectNative
                  value={o.estado}
                  onChange={(e) => actualizarEstado(o.id, e.target.value as LicitacionEstadoOrden)}
                  className="h-8 w-32"
                >
                  {ESTADOS_ORDEN.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}
                </SelectNative>
              </TD>
              <TD>
                <Input
                  defaultValue={o.comentario ?? ""}
                  onBlur={(e) => actualizarComentario(o.id, e.target.value)}
                  className="h-8"
                  placeholder="Comentario..."
                />
              </TD>
              <TD>
                <Button size="icon" variant="ghost" onClick={() => eliminar(o.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-danger" />
                </Button>
              </TD>
            </TR>
          ))}

          {/* fila para agregar nueva orden */}
          <TR>
            <TD>
              <SelectNative value={nueva.cliente_id} onChange={(e) => setNueva((f) => ({ ...f, cliente_id: e.target.value }))} className="h-8">
                <option value="">Elegir cliente...</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre} {c.apellido ?? ""}</option>)}
              </SelectNative>
            </TD>
            <TD>
              <Input type="number" value={nueva.monto} onChange={(e) => setNueva((f) => ({ ...f, monto: e.target.value }))} className="h-8 w-28" placeholder="Monto" />
            </TD>
            <TD>
              <SelectNative value={nueva.moneda} onChange={(e) => setNueva((f) => ({ ...f, moneda: e.target.value as MonedaTipo }))} className="h-8">
                {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
              </SelectNative>
            </TD>
            <TD className="text-xs text-muted-foreground">Tentativo</TD>
            <TD>
              <Input value={nueva.comentario} onChange={(e) => setNueva((f) => ({ ...f, comentario: e.target.value }))} className="h-8" placeholder="Comentario..." />
            </TD>
            <TD>
              <Button size="icon" variant="ghost" onClick={agregarOrden} disabled={guardando}>
                <Plus className="h-3.5 w-3.5 text-accent" />
              </Button>
            </TD>
          </TR>

          {ordenes.length === 0 && (
            <TR><TD colSpan={6} className="text-center text-muted-foreground py-6">Sin órdenes todavía — agregá la primera arriba.</TD></TR>
          )}
        </TBody>
      </Table>

      <div className="flex gap-3 text-sm">
        {Object.entries(totalPorMoneda).map(([moneda, total]) => (
          <Badge key={moneda} variant="accent">Total {moneda}: {formatUSD(total)}</Badge>
        ))}
      </div>
    </div>
  );
}
