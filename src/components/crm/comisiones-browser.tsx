"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import { Card, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD } from "@/lib/utils";
import { Download } from "lucide-react";

const MESES_NOMBRE = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export interface FilaComision {
  id: string;
  periodo_mes: number;
  periodo_anio: number;
  comitente: string | null;
  concepto: string | null;
  monto: number;
  cliente_nombre: string;
}

export function ComisionesBrowser({ filas, anios }: { filas: FilaComision[]; anios: number[] }) {
  const [anio, setAnio] = useState<string>(String(anios[0] ?? new Date().getFullYear()));
  const [mes, setMes] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");

  const filtradas = useMemo(() => {
    return filas.filter((f) => {
      const matchAnio = anio === "todos" || f.periodo_anio === Number(anio);
      const matchMes = mes === "todos" || f.periodo_mes === Number(mes);
      const matchBusqueda =
        !busqueda ||
        f.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (f.comitente ?? "").includes(busqueda);
      return matchAnio && matchMes && matchBusqueda;
    });
  }, [filas, anio, mes, busqueda]);

  const total = filtradas.reduce((s, f) => s + f.monto, 0);

  function exportarExcel() {
    const datos = filtradas.map((f) => ({
      Mes: MESES_NOMBRE[f.periodo_mes],
      Año: f.periodo_anio,
      Comitente: f.comitente ?? "",
      Cliente: f.cliente_nombre,
      Concepto: f.concepto ?? "",
      MontoUSD: f.monto,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comisiones");
    XLSX.writeFile(wb, "comisiones.xlsx");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SelectNative value={anio} onChange={(e) => setAnio(e.target.value)} className="w-32">
          <option value="todos">Todos los años</option>
          {anios.map((a) => <option key={a} value={a}>{a}</option>)}
        </SelectNative>
        <SelectNative value={mes} onChange={(e) => setMes(e.target.value)} className="w-40">
          <option value="todos">Todos los meses</option>
          {MESES_NOMBRE.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
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
          <span className="text-sm text-muted-foreground">{filtradas.length} operaciones</span>
          <span className="text-lg font-semibold tabular">{formatUSD(total)}</span>
        </CardContent>
      </Card>

      <Table>
        <THead>
          <TR><TH>Mes</TH><TH>Comitente</TH><TH>Cliente</TH><TH>Concepto</TH><TH>Monto</TH></TR>
        </THead>
        <TBody>
          {filtradas.slice(0, 500).map((f) => (
            <TR key={f.id}>
              <TD>{MESES_NOMBRE[f.periodo_mes]} {f.periodo_anio}</TD>
              <TD className="tabular">{f.comitente ?? "—"}</TD>
              <TD>{f.cliente_nombre}</TD>
              <TD className="text-muted-foreground">{f.concepto ?? "—"}</TD>
              <TD className="tabular">{formatUSD(f.monto)}</TD>
            </TR>
          ))}
          {filtradas.length === 0 && (
            <TR><TD colSpan={5} className="text-center text-muted-foreground py-8">Sin resultados con esos filtros.</TD></TR>
          )}
        </TBody>
      </Table>
      {filtradas.length > 500 && (
        <p className="text-center text-xs text-muted-foreground">
          Mostrando las primeras 500 de {filtradas.length} — usá los filtros o exportá a Excel para ver el resto.
        </p>
      )}
    </div>
  );
}
