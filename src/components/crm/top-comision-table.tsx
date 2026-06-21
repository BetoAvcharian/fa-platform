"use client";

import { useState } from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatUSD } from "@/lib/utils";

interface Fila {
  id: string;
  nombre: string;
  apellido: string | null;
  comision: number;
  porMes: { mes: string; total: number }[];
}

export function TopComisionTable({ filas }: { filas: Fila[] }) {
  const [seleccionado, setSeleccionado] = useState<Fila | null>(null);

  return (
    <>
      <Table>
        <THead><TR><TH>Cliente</TH><TH>Comisión YTD</TH></TR></THead>
        <TBody>
          {filas.map((c) => (
            <TR key={c.id}>
              <TD>
                <button onClick={() => setSeleccionado(c)} className="text-left hover:text-accent hover:underline">
                  {c.nombre} {c.apellido}
                </button>
              </TD>
              <TD className="tabular">{formatUSD(c.comision)}</TD>
            </TR>
          ))}
          {filas.length === 0 && (
            <TR><TD colSpan={2} className="text-center text-muted-foreground py-6">Sin comisiones cargadas.</TD></TR>
          )}
        </TBody>
      </Table>

      <Dialog open={!!seleccionado} onOpenChange={(o) => !o && setSeleccionado(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{seleccionado?.nombre} {seleccionado?.apellido} — Comisión por mes</DialogTitle>
          </DialogHeader>
          <Table>
            <THead><TR><TH>Mes</TH><TH>Total USD</TH></TR></THead>
            <TBody>
              {seleccionado?.porMes.map((m) => (
                <TR key={m.mes}><TD>{m.mes}</TD><TD className="tabular">{formatUSD(m.total)}</TD></TR>
              ))}
            </TBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}
