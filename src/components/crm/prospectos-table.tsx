"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatUSD, diasDesde } from "@/lib/utils";
import { Loader2, CheckCircle2, Download, XCircle, ArrowUpCircle, ArrowUp, ArrowDown } from "lucide-react";
import type { Cliente } from "@/lib/types";

type ProspectoRow = Cliente & { owner_nombre?: string };
type SortKey = "nombre" | "potencial" | "contacto" | "trabajando";

export function ProspectosTable({ prospectos }: { prospectos: ProspectoRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const search0 = searchParams.get("q") ?? "";
  const filtro = (searchParams.get("filtro") as "todos" | "trabajando" | "sin_trabajar") ?? "todos";
  const sortBy = (searchParams.get("sort") as SortKey) ?? "nombre";
  const sortDir = (searchParams.get("dir") as "asc" | "desc") ?? "asc";

  const [search, setSearch] = useState(search0);

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

  const [paraDescartar, setParaDescartar] = useState<{ id: string; nombre: string } | null>(null);
  const [descartando, setDescartando] = useState(false);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function toggleSort(key: SortKey) {
    if (sortBy === key) updateParams({ sort: key, dir: sortDir === "asc" ? "desc" : "asc" });
    else updateParams({ sort: key, dir: "asc" });
  }

  const filtrados = useMemo(() => {
    let resultado = prospectos.filter((p) => {
      const matchSearch = `${p.nombre} ${p.apellido ?? ""}`.toLowerCase().includes(search.toLowerCase());
      const matchFiltro =
        filtro === "todos" ||
        (filtro === "trabajando" && p.prospecto_trabajando) ||
        (filtro === "sin_trabajar" && !p.prospecto_trabajando);
      return matchSearch && matchFiltro;
    });

    const getVal = (p: ProspectoRow): string | number => {
      switch (sortBy) {
        case "nombre": return `${p.nombre} ${p.apellido ?? ""}`.toLowerCase();
        case "potencial": return p.potencial_usd ?? 0;
        case "contacto": return diasDesde(p.fecha_ultimo_contacto) ?? -1;
        case "trabajando": return p.prospecto_trabajando ? 1 : 0;
        default: return "";
      }
    };

    resultado = [...resultado].sort((a, b) => {
      const va = getVal(a), vb = getVal(b);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return resultado;
  }, [prospectos, search, filtro, sortBy, sortDir]);

  async function toggleTrabajando(id: string, actual: boolean) {
    const { error } = await supabase.from("clientes").update({ prospecto_trabajando: !actual }).eq("id", id);
    if (!error) router.refresh();
  }

  async function confirmarDescarte() {
    if (!paraDescartar) return;
    setDescartando(true);
    const { error } = await supabase.from("clientes").delete().eq("id", paraDescartar.id);
    setDescartando(false);
    if (error) {
      toast.error("Error al eliminar: " + error.message);
      return;
    }
    setParaDescartar(null);
    router.refresh();
  }

  async function avanzarACliente(id: string) {
    const { error } = await supabase.from("clientes").update({ tipo: "cliente", estado: "activo" }).eq("id", id);
    if (error) {
      return;
    }
    router.refresh();
  }

  function exportarExcel() {
    const datos = filtrados.map((p) => ({
      Nombre: `${p.nombre} ${p.apellido ?? ""}`.trim(),
      Email: p.email ?? "",
      Telefono: p.telefono ?? "",
      PotencialUSD: p.potencial_usd ?? 0,
      UltimoContacto: p.fecha_ultimo_contacto ?? "",
      Trabajando: p.prospecto_trabajando ? "Sí" : "No",
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prospectos");
    XLSX.writeFile(wb, "prospectos.xlsx");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <select
          value={filtro}
          onChange={(e) => updateParams({ filtro: e.target.value })}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="todos">Todos</option>
          <option value="trabajando">Trabajando</option>
          <option value="sin_trabajar">Sin trabajar</option>
        </select>
        <Button variant="outline" size="sm" onClick={exportarExcel} className="ml-auto">
          <Download className="h-3.5 w-3.5" /> Excel
        </Button>
        <span className="text-xs text-muted-foreground">{filtrados.length} resultados</span>
      </div>

      <Table>
        <THead>
          <TR>
            <SortableTH label="Nombre" sortKey="nombre" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
            <SortableTH label="Potencial" sortKey="potencial" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
            <SortableTH label="Último contacto" sortKey="contacto" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
            <SortableTH label="Estado" sortKey="trabajando" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {filtrados.map((p) => {
            const dias = diasDesde(p.fecha_ultimo_contacto);
            return (
              <TR key={p.id}>
                <TD>
                  <Link href={`/clientes/${p.id}`} className="font-medium hover:text-accent">
                    {p.nombre} {p.apellido}
                  </Link>
                </TD>
                <TD className="tabular">{formatUSD(p.potencial_usd ?? 0)}</TD>
                <TD>{dias === null ? "—" : <Badge variant={dias >= 60 ? "warning" : "default"}>{dias} días</Badge>}</TD>
                <TD>
                  <Badge variant={p.prospecto_trabajando ? "accent" : "default"}>
                    {p.prospecto_trabajando ? "Trabajando" : "Sin trabajar"}
                  </Badge>
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => toggleTrabajando(p.id, !!p.prospecto_trabajando)}>
                      {p.prospecto_trabajando ? <><CheckCircle2 className="h-3.5 w-3.5" /> Sin trabajar</> : <><Loader2 className="h-3.5 w-3.5" /> Trabajando</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setParaDescartar({ id: p.id, nombre: `${p.nombre} ${p.apellido ?? ""}` })}>
                      <XCircle className="h-3.5 w-3.5 text-danger" /> Descartar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => avanzarACliente(p.id)}>
                      <ArrowUpCircle className="h-3.5 w-3.5 text-success" /> A Cliente
                    </Button>
                  </div>
                </TD>
              </TR>
            );
          })}
          {filtrados.length === 0 && (
            <TR><TD colSpan={5} className="text-center text-muted-foreground py-8">Sin prospectos con esos filtros.</TD></TR>
          )}
        </TBody>
      </Table>

      <Dialog open={!!paraDescartar} onOpenChange={(o) => { if (!o) setParaDescartar(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Descartar a {paraDescartar?.nombre}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Esto borra el prospecto definitivamente, no se puede deshacer. ¿Confirmás?
            </p>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" onClick={() => setParaDescartar(null)}>Cancelar</Button>
              <Button variant="destructive" disabled={descartando} onClick={confirmarDescarte}>
                {descartando ? "Borrando..." : "Sí, descartar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableTH({
  label, sortKey, sortBy, sortDir, onSort,
}: { label: string; sortKey: SortKey; sortBy: SortKey; sortDir: "asc" | "desc"; onSort: (k: SortKey) => void }) {
  const active = sortBy === sortKey;
  return (
    <TH>
      <button onClick={() => onSort(sortKey)} className="flex items-center gap-1 hover:text-foreground">
        {label}
        {active && (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </button>
    </TH>
  );
}
