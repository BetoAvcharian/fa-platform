"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatUSD, diasDesde } from "@/lib/utils";
import type { Cliente } from "@/lib/types";
import { Download, ArrowUp, ArrowDown } from "lucide-react";

type ClienteRow = Cliente & { owner_nombre?: string; aum?: number };

const ESTADO_TONE = { activo: "success", inactivo: "default", perdido: "danger" } as const;

type SortKey = "nombre" | "tipo" | "estado" | "owner" | "aum" | "potencial" | "contacto";

export function ClientesTable({ clientes }: { clientes: ClienteRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tipo = searchParams.get("tipo") ?? "todos";
  const estado = searchParams.get("estado") ?? "todos";
  const sortBy = (searchParams.get("sort") as SortKey) ?? "nombre";
  const sortDir = (searchParams.get("dir") as "asc" | "desc") ?? "asc";

  // búsqueda: estado local instantáneo + sincronizado a la URL con debounce
  // (así no se vuelve a pedir la página en cada letra tipeada)
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("q", search);
      else params.delete("q");
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function toggleSort(key: SortKey) {
    if (sortBy === key) {
      updateParams({ sort: key, dir: sortDir === "asc" ? "desc" : "asc" });
    } else {
      updateParams({ sort: key, dir: "asc" });
    }
  }

  const filtrados = useMemo(() => {
    let resultado = clientes.filter((c) => {
      const nombreCompleto = `${c.nombre} ${c.apellido ?? ""}`.toLowerCase();
      const matchSearch = nombreCompleto.includes(search.toLowerCase());
      const matchTipo = tipo === "todos" || c.tipo === tipo;
      const matchEstado = estado === "todos" || c.estado === estado;
      return matchSearch && matchTipo && matchEstado;
    });

    const getVal = (c: ClienteRow): string | number => {
      switch (sortBy) {
        case "nombre": return `${c.nombre} ${c.apellido ?? ""}`.toLowerCase();
        case "tipo": return c.tipo;
        case "estado": return c.estado;
        case "owner": return c.owner_nombre ?? "";
        case "aum": return c.aum ?? 0;
        case "potencial": return c.potencial_usd ?? 0;
        case "contacto": return diasDesde(c.fecha_ultimo_contacto) ?? -1;
        default: return "";
      }
    };

    resultado = [...resultado].sort((a, b) => {
      const va = getVal(a), vb = getVal(b);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return resultado;
  }, [clientes, search, tipo, estado, sortBy, sortDir]);

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

  function SortableTH({ label, sortKey }: { label: string; sortKey: SortKey }) {
    const active = sortBy === sortKey;
    return (
      <TH>
        <button onClick={() => toggleSort(sortKey)} className="flex items-center gap-1 hover:text-foreground">
          {label}
          {active && (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
        </button>
      </TH>
    );
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
          onChange={(e) => updateParams({ tipo: e.target.value })}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="todos">Todos los tipos</option>
          <option value="cliente">Cliente</option>
          <option value="prospecto">Prospecto</option>
        </select>
        <select
          value={estado}
          onChange={(e) => updateParams({ estado: e.target.value })}
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
            <SortableTH label="Nombre" sortKey="nombre" />
            <SortableTH label="Tipo" sortKey="tipo" />
            <SortableTH label="Estado" sortKey="estado" />
            <SortableTH label="Owner" sortKey="owner" />
            <SortableTH label="AUM" sortKey="aum" />
            <SortableTH label="Potencial" sortKey="potencial" />
            <SortableTH label="Último contacto" sortKey="contacto" />
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
