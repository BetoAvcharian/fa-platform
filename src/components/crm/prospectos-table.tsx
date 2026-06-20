"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { formatUSD, diasDesde } from "@/lib/utils";
import { Loader2, CheckCircle2, Download, XCircle, ArrowUpCircle } from "lucide-react";
import type { Cliente } from "@/lib/types";

type ProspectoRow = Cliente & { owner_nombre?: string };

export function ProspectosTable({ prospectos }: { prospectos: ProspectoRow[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "trabajando" | "sin_trabajar">("todos");

  const filtrados = useMemo(() => {
    return prospectos.filter((p) => {
      const matchSearch = `${p.nombre} ${p.apellido ?? ""}`.toLowerCase().includes(search.toLowerCase());
      const matchFiltro =
        filtro === "todos" ||
        (filtro === "trabajando" && p.prospecto_trabajando) ||
        (filtro === "sin_trabajar" && !p.prospecto_trabajando);
      return matchSearch && matchFiltro;
    });
  }, [prospectos, search, filtro]);

  async function toggleTrabajando(id: string, actual: boolean) {
    const { error } = await supabase.from("clientes").update({ prospecto_trabajando: !actual }).eq("id", id);
    if (!error) router.refresh();
  }

  async function descartar(id: string) {
    const { error } = await supabase.from("clientes").update({ estado: "perdido" }).eq("id", id);
    if (error) {
      return;
    }
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
          onChange={(e) => setFiltro(e.target.value as any)}
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
          <TR><TH>Nombre</TH><TH>Potencial</TH><TH>Último contacto</TH><TH>Estado</TH><TH></TH></TR>
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
                    <Button size="sm" variant="outline" onClick={() => descartar(p.id)}>
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
    </div>
  );
}
