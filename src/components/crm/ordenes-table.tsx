"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatUSD } from "@/lib/utils";
import { ESTADOS_ORDEN, MONEDAS, type LicitacionOrden, type LicitacionEstadoOrden, type MonedaTipo } from "@/lib/types";
import { Plus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { ClienteCombobox } from "@/components/crm/cliente-combobox";

type OrdenRow = LicitacionOrden & { cliente_nombre?: string };
interface ClienteOption { id: string; nombre: string; apellido: string | null }

const ESTADO_TONE: Record<LicitacionEstadoOrden, "default" | "success" | "warning" | "danger" | "accent"> = {
  tentativo: "warning",
  confirmada: "success",
  cargada: "accent",
  cancelada: "danger",
};

const ESTADO_BG: Record<LicitacionEstadoOrden, string> = {
  tentativo: "bg-warning/10",
  confirmada: "bg-success/10",
  cargada: "bg-accent/10",
  cancelada: "bg-danger/5 opacity-60",
};

export function OrdenesTable({
  licitacionId,
  ordenes,
  clientes,
  monedaBase,
  arancelPct,
  cuentasPorCliente,
}: {
  licitacionId: string;
  ordenes: OrdenRow[];
  clientes: ClienteOption[];
  monedaBase: MonedaTipo;
  arancelPct: number | null;
  cuentasPorCliente: Record<string, string[]>;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [nueva, setNueva] = useState({ cliente_id: "", comitente: "", monto: "", moneda: monedaBase, comentario: "" });
  const [guardando, setGuardando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [editandoArancel, setEditandoArancel] = useState(false);
  const [arancelTemp, setArancelTemp] = useState(String(arancelPct ?? ""));

  const cuentasDelClienteElegido = cuentasPorCliente[nueva.cliente_id] ?? [];

  function elegirCliente(id: string) {
    const cuentas = cuentasPorCliente[id] ?? [];
    // si tiene una sola cuenta, se completa sola; si tiene 2+, queda para elegir; si no tiene, queda libre
    setNueva((f) => ({ ...f, cliente_id: id, comitente: cuentas.length === 1 ? cuentas[0] : "" }));
  }

  async function guardarArancel() {
    setEditandoArancel(false);
    const valor = arancelTemp ? Number(arancelTemp) : null;
    await supabase.from("licitaciones").update({ arancel_pct: valor }).eq("id", licitacionId);
    router.refresh();
  }

  async function agregarOrden() {
    if (!nueva.cliente_id || !nueva.monto) {
      toast.error("Elegí un cliente y un monto");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("licitacion_ordenes").insert({
      licitacion_id: licitacionId,
      cliente_id: nueva.cliente_id,
      comitente: nueva.comitente || null,
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
    setNueva({ cliente_id: "", comitente: "", monto: "", moneda: monedaBase, comentario: "" });
    router.refresh();
  }

  async function actualizarEstado(id: string, estado: LicitacionEstadoOrden) {
    await supabase.from("licitacion_ordenes").update({ estado }).eq("id", id);
    router.refresh();
  }

  async function actualizarComentario(id: string, comentario: string) {
    const { error } = await supabase.from("licitacion_ordenes").update({ comentario }).eq("id", id);
    if (error) {
      toast.error("No se guardó el comentario: " + error.message);
      return;
    }
    router.refresh();
  }

  async function actualizarComitente(id: string, comitente: string) {
    const { error } = await supabase.from("licitacion_ordenes").update({ comitente: comitente || null }).eq("id", id);
    if (error) {
      toast.error("No se guardó el comitente: " + error.message);
      return;
    }
    router.refresh();
  }

  async function eliminar(id: string) {
    await supabase.from("licitacion_ordenes").delete().eq("id", id);
    router.refresh();
  }

  function exportarExcel() {
    const datos = ordenes.map((o) => ({
      Cliente: o.cliente_nombre,
      Comitente: o.comitente ?? "",
      Monto: o.monto,
      Moneda: o.moneda,
      Estado: ESTADOS_ORDEN.find((e) => e.key === o.estado)?.label ?? o.estado,
      Comentario: o.comentario ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ordenes");
    XLSX.writeFile(wb, "ordenes_licitacion.xlsx");
  }

  const ordenesFiltradas = useMemo(() => {
    if (filtroEstado === "todos") return ordenes;
    return ordenes.filter((o) => o.estado === filtroEstado);
  }, [ordenes, filtroEstado]);

  const totalConfirmadoCargado = ordenes
    .filter((o) => o.estado === "confirmada" || o.estado === "cargada")
    .reduce((sum, o) => sum + Number(o.monto), 0);
  const totalTentativo = ordenes
    .filter((o) => o.estado === "tentativo")
    .reduce((sum, o) => sum + Number(o.monto), 0);

  const totalPorMoneda = ordenes.reduce<Record<string, number>>((acc, o) => {
    acc[o.moneda] = (acc[o.moneda] ?? 0) + Number(o.monto);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Confirmado + Cargado</p>
            <p className="mt-1 text-xl font-semibold text-success">{formatUSD(totalConfirmadoCargado)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Tentativo</p>
            <p className="mt-1 text-xl font-semibold text-warning">{formatUSD(totalTentativo)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Comisión estimada</p>
              {!editandoArancel ? (
                <button onClick={() => { setArancelTemp(String(arancelPct ?? "")); setEditandoArancel(true); }} className="text-xs text-accent hover:underline">
                  Arancel: {arancelPct ?? "—"}%
                </button>
              ) : (
                <input
                  autoFocus
                  type="number"
                  step="0.01"
                  value={arancelTemp}
                  onChange={(e) => setArancelTemp(e.target.value)}
                  onBlur={guardarArancel}
                  onKeyDown={(e) => e.key === "Enter" && guardarArancel()}
                  placeholder="% arancel"
                  className="h-6 w-20 rounded border border-border bg-background px-1 text-xs"
                />
              )}
            </div>
            <p className="mt-1 text-xl font-semibold text-accent">
              {arancelPct ? formatUSD(totalConfirmadoCargado * (arancelPct / 100)) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar por estado:</span>
          <SelectNative value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="h-8 w-40">
            <option value="todos">Todos</option>
            {ESTADOS_ORDEN.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}
          </SelectNative>
        </div>
        <Button size="sm" variant="outline" onClick={exportarExcel} disabled={ordenes.length === 0}>
          <Download className="h-3.5 w-3.5" /> Descargar Excel
        </Button>
      </div>

      <Table>
        <THead>
          <TR><TH>Cliente</TH><TH>Comitente</TH><TH>Monto</TH><TH>Moneda</TH><TH>Estado</TH><TH>Comentario</TH><TH></TH></TR>
        </THead>
        <TBody>
          {ordenesFiltradas.map((o) => (
            <TR key={o.id} className={ESTADO_BG[o.estado]}>
              <TD>{o.cliente_nombre}</TD>
              <TD>
                <Input
                  defaultValue={o.comitente ?? ""}
                  onBlur={(e) => actualizarComitente(o.id, e.target.value)}
                  className="h-8 w-28 tabular"
                  placeholder="Comitente"
                />
              </TD>
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
              <ClienteCombobox
                clientes={clientes}
                value={nueva.cliente_id}
                onChange={elegirCliente}
                placeholder="Elegir cliente..."
                permitirVacio={false}
              />
            </TD>
            <TD>
              {cuentasDelClienteElegido.length >= 2 ? (
                <SelectNative
                  value={nueva.comitente}
                  onChange={(e) => setNueva((f) => ({ ...f, comitente: e.target.value }))}
                  className="h-8 w-32"
                >
                  <option value="">Elegir cuenta...</option>
                  {cuentasDelClienteElegido.map((c) => <option key={c} value={c}>{c}</option>)}
                </SelectNative>
              ) : (
                <Input
                  value={nueva.comitente}
                  onChange={(e) => setNueva((f) => ({ ...f, comitente: e.target.value }))}
                  className="h-8 w-28"
                  placeholder="Comitente"
                />
              )}
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

          {ordenesFiltradas.length === 0 && (
            <TR><TD colSpan={7} className="text-center text-muted-foreground py-6">Sin órdenes con ese filtro.</TD></TR>
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
