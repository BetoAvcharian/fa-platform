"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD, diasDesde } from "@/lib/utils";
import type { Cliente } from "@/lib/types";
import { Download } from "lucide-react";

type ClienteRow = Cliente & { owner_nombre?: string; aum?: number };

const ESTADO_TONE = { activo: "success", inactivo: "default", perdido: "danger" } as const;

export function ClientesTable({ clientes }: { clientes: ClienteRow[] }) {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState<string>("todos");
  const [estado, setEstado] = useState<string>("todos");

  const filtrados = useMemo(() => {
    return clientes.filter((c) => {
      const nombreCompleto = `${c.nombre} ${c.apellido ?? ""}`.toLowerCase();
      const matchSearch = nombreCompleto.includes(search.toLowerCase());
      const matchTipo = tipo === "todos" || c.tipo === tipo;
      const matchEstado = estado === "todos" || c.estado === estado;
      return matchSearch && matchTipo && matchEstado;
    });
  }, [clientes, search, tipo, estado]);

  function exportarExcel() {
    const datos = filtrados.map((c) => ({
      Nombre: `${c.nombre} ${c.apellido ?? ""}`.trim(),
      Tipo: c.tipo,
      Estado: c.estado,
      Owner: c.owner_nombre ?? "",
      Email: c.email ?? "",
      Telefono: c.telefono ?? "",
      AUM: c.aum ?? 0,
      PotencialUSD: c.potencial_usd ?? 0,
      UltimoContacto: c.fecha_ultimo_contacto ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "clientes.xlsx");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="todos">Todos los tipos</option>
          <option value="cliente">Cliente</option>
          <option value="prospecto">Prospecto</option>
        </select>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="perdido">Perdido</option>
        </select>
        <Button variant="outline" size="sm" onClick={exportarExcel} className="ml-auto">
          <Download className="h-3.5 w-3.5" /> Excel
        </Button>
        <span className="text-xs text-muted-foreground">{filtrados.length} resultados</span>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Nombre</TH>
            <TH>Tipo</TH>
            <TH>Estado</TH>
            <TH>Owner</TH>
            <TH>AUM</TH>
            <TH>Potencial</TH>
            <TH>Último contacto</TH>
          </TR>
        </THead>
        <TBody>
          {filtrados.map((c) => {
            const dias = diasDesde(c.fecha_ultimo_contacto);
            return (
              <TR key={c.id}>
                <TD>
                  <Link href={`/clientes/${c.id}`} className="font-medium hover:text-accent">
                    {c.nombre} {c.apellido}
                  </Link>
                </TD>
                <TD className="capitalize">{c.tipo}</TD>
                <TD>
                  <Badge variant={ESTADO_TONE[c.estado]}>{c.estado}</Badge>
                </TD>
                <TD className="text-muted-foreground">{c.owner_nombre ?? "—"}</TD>
                <TD className="tabular">{formatUSD(c.aum ?? 0)}</TD>
                <TD className="tabular">{formatUSD(c.potencial_usd ?? 0)}</TD>
                <TD>
                  {dias === null ? (
                    "—"
                  ) : (
                    <Badge variant={dias >= 90 ? "danger" : dias >= 60 ? "warning" : "default"}>
                      {dias} días
                    </Badge>
                  )}
                </TD>
              </TR>
            );
          })}
          {filtrados.length === 0 && (
            <TR>
              <TD colSpan={7} className="text-center text-muted-foreground py-8">
                No se encontraron clientes con esos filtros.
              </TD>
            </TR>
          )}
        </TBody>
      </Table>
    </div>
  );
}
