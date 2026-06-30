"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { formatUSD } from "@/lib/utils";
import { Download, Pencil, Trash2, ArrowLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export interface FilaPatrimonio {
  id: string;
  fecha_carga: string;
  numero_cuenta: string;
  aum: number;
  cash: number;
  cliente_nombre: string;
}

export function PatrimonioBrowser({ filas }: { filas: FilaPatrimonio[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<FilaPatrimonio | null>(null);
  const [editAum, setEditAum] = useState("");
  const [editCash, setEditCash] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [paraBorrar, setParaBorrar] = useState<FilaPatrimonio | null>(null);
  const [borrando, setBorrando] = useState(false);
  const [paraBorrarLote, setParaBorrarLote] = useState<string | null>(null);
  const [borrandoLote, setBorrandoLote] = useState(false);

  const porFecha = useMemo(() => {
    const mapa = new Map<string, { total: number; cuentas: number }>();
    filas.forEach((f) => {
      const actual = mapa.get(f.fecha_carga) ?? { total: 0, cuentas: 0 };
      actual.total += f.aum;
      actual.cuentas += 1;
      mapa.set(f.fecha_carga, actual);
    });
    return Array.from(mapa.entries())
      .map(([fecha, v]) => ({ fecha, ...v }))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [filas]);

  const detalleDeFecha = useMemo(() => {
    if (!fechaSeleccionada) return [];
    return filas
      .filter((f) => f.fecha_carga === fechaSeleccionada)
      .filter((f) => !busqueda || f.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()) || f.numero_cuenta.includes(busqueda))
      .sort((a, b) => b.aum - a.aum);
  }, [filas, fechaSeleccionada, busqueda]);

  function abrirEditar(f: FilaPatrimonio) {
    setEditando(f);
    setEditAum(String(f.aum));
    setEditCash(String(f.cash));
  }

  async function guardarEdicion() {
    if (!editando) return;
    setGuardando(true);
    const { error } = await supabase
      .from("patrimonio")
      .update({ aum: Number(editAum) || 0, cash: Number(editCash) || 0 })
      .eq("id", editando.id);
    setGuardando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Corregido");
    setEditando(null);
    router.refresh();
  }

  async function confirmarBorrado() {
    if (!paraBorrar) return;
    setBorrando(true);
    const { error } = await supabase.from("patrimonio").delete().eq("id", paraBorrar.id);
    setBorrando(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success("Eliminado");
    setParaBorrar(null);
    router.refresh();
  }

  async function confirmarBorradoLote() {
    if (!paraBorrarLote) return;
    setBorrandoLote(true);
    const { error } = await supabase.from("patrimonio").delete().eq("fecha_carga", paraBorrarLote);
    setBorrandoLote(false);
    if (error) {
      toast.error("Error: " + error.message);
      return;
    }
    toast.success(`Se borró todo el lote del ${paraBorrarLote}`);
    setParaBorrarLote(null);
    if (fechaSeleccionada === paraBorrarLote) setFechaSeleccionada(null);
    router.refresh();
  }

  function exportarExcel(datos: FilaPatrimonio[], filename: string) {
    const ws = XLSX.utils.json_to_sheet(
      datos.map((f) => ({ Fecha: f.fecha_carga, Comitente: f.numero_cuenta, Cliente: f.cliente_nombre, AUM: f.aum, Cash: f.cash }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patrimonio");
    XLSX.writeFile(wb, filename);
  }

  if (!fechaSeleccionada) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Tocá una fecha de cierre para ver el detalle por cuenta</p>
          <Button variant="outline" size="sm" onClick={() => exportarExcel(filas, "patrimonio_todo.xlsx")}>
            <Download className="h-3.5 w-3.5" /> Excel (todo)
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {porFecha.map((f) => (
            <Card key={f.fecha} className="transition-colors hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setFechaSeleccionada(f.fecha)}>
                  <div>
                    <p className="font-medium">{f.fecha}</p>
                    <p className="text-xs text-muted-foreground">{f.cuentas} cuentas</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold tabular text-accent">{formatUSD(f.total)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setParaBorrarLote(f.fecha); }}
                  className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="h-3 w-3" /> Eliminar todo este lote
                </button>
              </CardContent>
            </Card>
          ))}
          {porFecha.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Sin patrimonio cargado todavía.</p>}
        </div>

        <Dialog open={!!paraBorrarLote} onOpenChange={(o) => !o && setParaBorrarLote(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Eliminar todo el lote del {paraBorrarLote}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Esto borra **todas** las filas de patrimonio cargadas para la fecha {paraBorrarLote} (de todos los clientes). Usalo si subiste mal un archivo completo. No se puede deshacer.
              </p>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <Button variant="outline" onClick={() => setParaBorrarLote(null)}>Cancelar</Button>
                <Button variant="destructive" disabled={borrandoLote} onClick={confirmarBorradoLote}>
                  {borrandoLote ? "Eliminando..." : "Sí, eliminar todo el lote"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const totalFecha = detalleDeFecha.reduce((s, f) => s + f.aum, 0);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => { setFechaSeleccionada(null); setBusqueda(""); }} className="-ml-2">
        <ArrowLeft className="h-4 w-4" /> Volver a todas las fechas
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">{fechaSeleccionada}</h2>
        <Input
          placeholder="Buscar por cliente o comitente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs ml-2"
        />
        <Button variant="outline" size="sm" onClick={() => exportarExcel(detalleDeFecha, `patrimonio_${fechaSeleccionada}.xlsx`)} className="ml-auto">
          <Download className="h-3.5 w-3.5" /> Excel
        </Button>
        <Button variant="outline" size="sm" onClick={() => setParaBorrarLote(fechaSeleccionada)} className="text-danger">
          <Trash2 className="h-3.5 w-3.5" /> Eliminar lote
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <span className="text-sm text-muted-foreground">{detalleDeFecha.length} cuentas</span>
          <span className="text-lg font-semibold tabular">{formatUSD(totalFecha)}</span>
        </CardContent>
      </Card>

      <Table>
        <THead><TR><TH>Comitente</TH><TH>Cliente</TH><TH>AUM</TH><TH>Cash</TH><TH></TH></TR></THead>
        <TBody>
          {detalleDeFecha.map((f) => (
            <TR key={f.id}>
              <TD className="tabular">{f.numero_cuenta}</TD>
              <TD>{f.cliente_nombre}</TD>
              <TD className="tabular">{formatUSD(f.aum)}</TD>
              <TD className="tabular">{formatUSD(f.cash)}</TD>
              <TD>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => abrirEditar(f)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setParaBorrar(f)}>
                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                  </Button>
                </div>
              </TD>
            </TR>
          ))}
          {detalleDeFecha.length === 0 && (
            <TR><TD colSpan={5} className="text-center text-muted-foreground py-8">Sin resultados con esos filtros.</TD></TR>
          )}
        </TBody>
      </Table>

      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Corregir {editando?.numero_cuenta} — {editando?.fecha_carga}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">AUM</label>
                <Input type="number" value={editAum} onChange={(e) => setEditAum(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Cash</label>
                <Input type="number" value={editCash} onChange={(e) => setEditCash(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
              <Button disabled={guardando} onClick={guardarEdicion}>{guardando ? "Guardando..." : "Guardar"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!paraBorrar} onOpenChange={(o) => !o && setParaBorrar(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Eliminar registro</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Vas a borrar el registro de {paraBorrar?.numero_cuenta} del {paraBorrar?.fecha_carga}. No se puede deshacer.
            </p>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" onClick={() => setParaBorrar(null)}>Cancelar</Button>
              <Button variant="destructive" disabled={borrando} onClick={confirmarBorrado}>
                {borrando ? "Eliminando..." : "Sí, eliminar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!paraBorrarLote} onOpenChange={(o) => !o && setParaBorrarLote(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Eliminar todo el lote del {paraBorrarLote}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Esto borra todas las filas de patrimonio cargadas para la fecha {paraBorrarLote} (de todos los clientes). Usalo si subiste mal un archivo completo. No se puede deshacer.
            </p>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" onClick={() => setParaBorrarLote(null)}>Cancelar</Button>
              <Button variant="destructive" disabled={borrandoLote} onClick={confirmarBorradoLote}>
                {borrandoLote ? "Eliminando..." : "Sí, eliminar todo el lote"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
