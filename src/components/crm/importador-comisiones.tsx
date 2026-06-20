"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { formatNumberAR } from "@/lib/utils";
import { Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface FilaComision {
  Comitente: string;
  Concepto: string;
  Monto: number;
}

function normalizar(s: string) {
  return s.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function ImportadorComisiones() {
  const [filas, setFilas] = useState<FilaComision[]>([]);
  const [mes, setMes] = useState(String(new Date().getMonth() + 1));
  const [anio, setAnio] = useState(String(new Date().getFullYear()));
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const supabase = createClient();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGuardado(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });

      const json: FilaComision[] = rawRows.map((row) => {
        const out: any = {};
        for (const key of Object.keys(row)) {
          const norm = normalizar(key);
          if (norm.includes("comitente") || norm.includes("cuenta")) out.Comitente = row[key];
          else if (norm.includes("concepto") || norm.includes("detalle")) out.Concepto = row[key];
          else if (norm.includes("monto") || norm.includes("comision") || norm.includes("importe")) out.Monto = row[key];
        }
        return out;
      });

      const validas = json.filter((f) => f.Monto !== undefined && !isNaN(Number(f.Monto)));
      setFilas(validas);
      if (validas.length !== json.length) {
        toast.warning(`Se omitieron ${json.length - validas.length} filas sin Monto válido`);
      }
    };
    reader.readAsBinaryString(file);
  }

  async function confirmarImportacion() {
    setGuardando(true);
    const { data: { user } } = await supabase.auth.getUser();

    const registros = filas.map((f) => ({
      periodo_mes: Number(mes),
      periodo_anio: Number(anio),
      comitente: f.Comitente ? String(f.Comitente) : null,
      concepto: f.Concepto || null,
      monto: Number(f.Monto) || 0,
      owner_id: user?.id,
    }));

    const { error } = await supabase.from("comisiones").insert(registros);
    setGuardando(false);

    if (error) {
      toast.error("Error al guardar: " + error.message);
      return;
    }
    setGuardado(true);
    toast.success(`${registros.length} comisiones cargadas para ${mes}/${anio}`);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Subir comisiones del mes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Columnas esperadas: <code className="text-xs">Comitente</code> (vacío para premios sin cliente), <code className="text-xs">Concepto</code>, <code className="text-xs">Monto</code>.
          </p>
          <div className="flex gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Mes</label>
              <Input type="number" min={1} max={12} value={mes} onChange={(e) => setMes(e.target.value)} className="w-20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Año</label>
              <Input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} className="w-24" />
            </div>
          </div>
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm hover:bg-muted">
            <Upload className="h-4 w-4" />
            Elegir archivo Excel (.xlsx)
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
          </label>
        </CardContent>
      </Card>

      {filas.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Vista previa ({filas.length} filas) — Periodo {mes}/{anio}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Table>
              <THead><TR><TH>Comitente</TH><TH>Concepto</TH><TH>Monto</TH></TR></THead>
              <TBody>
                {filas.slice(0, 20).map((f, i) => (
                  <TR key={i}>
                    <TD className="tabular">{f.Comitente || "— (premio sin cliente)"}</TD>
                    <TD>{f.Concepto || "—"}</TD>
                    <TD className="tabular">{formatNumberAR(Number(f.Monto))}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <Button onClick={confirmarImportacion} disabled={guardando || guardado}>
              {guardado ? <><CheckCircle2 className="h-4 w-4" /> Importado</> : guardando ? "Guardando..." : "Confirmar importación"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
