"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD } from "@/lib/utils";
import { Download, ArrowLeft, ChevronRight } from "lucide-react";

const MESES_NOMBRE = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export interface FilaComisionResumen {
  id: string;
  periodo_mes: number;
  periodo_anio: number;
  cliente_nombre: string;
  total: number;
  operaciones: number;
}

export function ComisionesBrowser({ filas }: { filas: FilaComisionResumen[] }) {
  const [mesSeleccionado, setMesSeleccionado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const porMes = useMemo(() => {
    const mapa = new Map<string, { anio: number; mes: number; total: number; operaciones: number; clientes: number }>();
    filas.forEach((f) => {
      const key = `${f.periodo_anio}-${f.periodo_mes}`;
      const actual = mapa.get(key) ?? { anio: f.periodo_anio, mes: f.periodo_mes, total: 0, operaciones: 0, clientes: 0 };
      actual.total += f.total;
      actual.operaciones += f.operaciones;
      actual.clientes += 1;
      mapa.set(key, actual);
    });
    return Array.from(mapa.entries())
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.anio - a.anio || b.mes - a.mes);
  }, [filas]);

  const detalleDelMes = useMemo(() => {
    if (!mesSeleccionado) return [];
    return filas
      .filter((f) => `${f.periodo_anio}-${f.periodo_mes}` === mesSeleccionado)
      .filter((f) => !busqueda || f.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [filas, mesSeleccionado, busqueda]);

  function exportarExcel(datos: FilaComisionResumen[], filename: string) {
    const ws = XLSX.utils.json_to_sheet(
      datos.map((f) => ({ Mes: MESES_NOMBRE[f.periodo_mes], Año: f.periodo_anio, Cliente: f.cliente_nombre, Operaciones: f.operaciones, TotalUSD: f.total }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comisiones");
    XLSX.writeFile(wb, filename);
  }

  if (!mesSeleccionado) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Tocá un mes para ver el detalle por cliente</p>
          <Button variant="outline" size="sm" onClick={() => exportarExcel(filas, "comisiones_todo.xlsx")}>
            <Download className="h-3.5 w-3.5" /> Excel (todo)
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {porMes.map((m) => (
            <button key={m.key} onClick={() => setMesSeleccionado(m.key)} className="text-left">
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{MESES_NOMBRE[m.mes]} {m.anio}</p>
                    <p className="text-xs text-muted-foreground">{m.clientes} clientes · {m.operaciones} operaciones</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold tabular text-accent">{formatUSD(m.total)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
          {porMes.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Sin comisiones cargadas todavía.</p>}
        </div>
      </div>
    );
  }

  const [anioSel, mesSel] = mesSeleccionado.split("-").map(Number);
  const totalMes = detalleDelMes.reduce((s, f) => s + f.total, 0);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => { setMesSeleccionado(null); setBusqueda(""); }} className="-ml-2">
        <ArrowLeft className="h-4 w-4" /> Volver a todos los meses
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">{MESES_NOMBRE[mesSel]} {anioSel}</h2>
        <Input
          placeholder="Buscar por cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs ml-2"
        />
        <Button variant="outline" size="sm" onClick={() => exportarExcel(detalleDelMes, `comisiones_${MESES_NOMBRE[mesSel]}_${anioSel}.xlsx`)} className="ml-auto">
          <Download className="h-3.5 w-3.5" /> Excel
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <span className="text-sm text-muted-foreground">{detalleDelMes.length} clientes</span>
          <span className="text-lg font-semibold tabular">{formatUSD(totalMes)}</span>
        </CardContent>
      </Card>

      <Table>
        <THead><TR><TH>Cliente</TH><TH>Operaciones</TH><TH>Total</TH></TR></THead>
        <TBody>
          {detalleDelMes.map((f) => (
            <TR key={f.id}>
              <TD>{f.cliente_nombre}</TD>
              <TD className="tabular">{f.operaciones}</TD>
              <TD className="tabular">{formatUSD(f.total)}</TD>
            </TR>
          ))}
          {detalleDelMes.length === 0 && (
            <TR><TD colSpan={3} className="text-center text-muted-foreground py-8">Sin resultados con esos filtros.</TD></TR>
          )}
        </TBody>
      </Table>
    </div>
  );
}
