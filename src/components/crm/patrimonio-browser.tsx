"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import { Card, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { formatUSD } from "@/lib/utils";
import { Download, Pencil, Trash2 } from "lucide-react";
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

  const fechas = Array.from(new Set(filas.map((f) => f.fecha_carga))).sort((a, b) => b.localeCompare(a));
  const [fecha, setFecha] = useState<string>(fechas[0] ?? "todas");
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<FilaPatrimonio | null>(null);
  const [editAum, setEditAum] = useState("");
  const [editCash, setEditCash] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [paraBorrar, setParaBorrar] = useState<FilaPatrimonio | null>(null);
  const [borrando, setBorrando] = useState(false);

  const filtradas = useMemo(() => {
    return filas
      .filter((f) => fecha === "todas" || f.fecha_carga === fecha)
      .filter((f) => !busqueda || f.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()) || f.numero_cuenta.includes(busqueda))
      .sort((a, b) => b.fecha_carga.localeCompare(a.fecha_carga));
  }, [filas, fecha, busqueda]);

  const total = filtradas.reduce((s, f) => s + f.aum, 0);

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

  function exportarExcel() {
    const datos = filtradas.map((f) => ({
      Fecha: f.fecha_carga,
      Comitente: f.numero_cuenta,
      Cliente: f.cliente_nombre,
      AUM: f.aum,
      Cash: f.cash,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patrimonio");
    XLSX.writeFile(wb, "patrimonio.xlsx");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SelectNative value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-44">
          <option value="todas">Todas las fechas</option>
          {fechas.map((f) => <option key={f} value={f}>{f}</option>)}
        </SelectNative>
        <Input
          placeholder="Buscar por cliente o comitente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" size="sm" onClick={exportarExcel} className="ml-auto">
          <Download className="h-3.5 w-3.5" /> Excel
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <span className="text-sm text-muted-foreground">{filtradas.length} registros</span>
          <span className="text-lg font-semibold tabular">{formatUSD(total)}</span>
        </CardContent>
      </Card>

      <Table>
        <THead>
          <TR><TH>Fecha</TH><TH>Comitente</TH><TH>Cliente</TH><TH>AUM</TH><TH>Cash</TH><TH></TH></TR>
        </THead>
        <TBody>
          {filtradas.slice(0, 500).map((f) => (
            <TR key={f.id}>
              <TD>{f.fecha_carga}</TD>
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
          {filtradas.length === 0 && (
            <TR><TD colSpan={6} className="text-center text-muted-foreground py-8">Sin resultados con esos filtros.</TD></TR>
          )}
        </TBody>
      </Table>
      {filtradas.length > 500 && (
        <p className="text-center text-xs text-muted-foreground">
          Mostrando las primeras 500 de {filtradas.length} — usá los filtros o exportá a Excel para ver el resto.
        </p>
      )}

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
    </div>
  );
}
