"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { formatNumberAR } from "@/lib/utils";
import { Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface FilaPatrimonio {
  NumeroCuenta: string;
  AUM: number;
  Cash: number;
}

export function ImportadorPatrimonio() {
  const [filas, setFilas] = useState<FilaPatrimonio[]>([]);
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

      // normaliza encabezados: sin espacios, sin tildes, minúsculas
      function normalizar(s: string) {
        return s
          .toString()
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      }

      const json: FilaPatrimonio[] = rawRows.map((row) => {
        const out: any = {};
        for (const key of Object.keys(row)) {
          const norm = normalizar(key);
          if (norm.includes("cuenta") || norm.includes("comitente")) out.NumeroCuenta = row[key];
          else if (norm === "aum" || norm.includes("patrimonio")) out.AUM = row[key];
          else if (norm === "cash" || norm.includes("disponible")) out.Cash = row[key];
        }
        return out;
      });

      const validas = json.filter((f) => f.NumeroCuenta && f.NumeroCuenta !== "" && !isNaN(Number(f.AUM)) && f.AUM !== undefined);
      if (validas.length !== json.length) {
        toast.warning(`Se omitieron ${json.length - validas.length} filas inválidas (sin cuenta o sin AUM numérico)`);
      }
      setFilas(validas);
    };
    reader.readAsBinaryString(file);
  }

  async function confirmarImportacion() {
    setGuardando(true);
    const hoy = new Date().toISOString().slice(0, 10);
    const registros = filas.map((f) => ({
      fecha_carga: hoy,
      numero_cuenta: String(f.NumeroCuenta),
      aum: Number(f.AUM) || 0,
      cash: Number(f.Cash) || 0,
    }));

    // siempre INSERT, nunca update -> se preserva el histórico completo
    const { error } = await supabase.from("patrimonio").insert(registros);
    setGuardando(false);

    if (error) {
      toast.error("Error al guardar: " + error.message);
      return;
    }
    setGuardado(true);
    toast.success(`${registros.length} registros cargados al histórico de patrimonio`);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Subir archivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Columnas esperadas (no importa mayúsculas/tildes): algo como <code className="text-xs">NumeroCuenta</code> o <code className="text-xs">Comitente</code>,
            <code className="text-xs"> AUM</code>, <code className="text-xs">Cash</code>.
            Cada carga se guarda como un nuevo punto histórico — nunca se sobrescribe lo anterior.
          </p>
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm hover:bg-muted">
            <Upload className="h-4 w-4" />
            Elegir archivo Excel (.xlsx)
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
          </label>
        </CardContent>
      </Card>

      {filas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vista previa ({filas.length} filas)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Table>
              <THead><TR><TH>Cuenta</TH><TH>AUM</TH><TH>Cash</TH></TR></THead>
              <TBody>
                {filas.slice(0, 20).map((f, i) => (
                  <TR key={i}>
                    <TD className="tabular">{f.NumeroCuenta}</TD>
                    <TD className="tabular">{formatNumberAR(Number(f.AUM))}</TD>
                    <TD className="tabular">{formatNumberAR(Number(f.Cash))}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            {filas.length > 20 && <p className="text-xs text-muted-foreground">...y {filas.length - 20} filas más</p>}

            <Button onClick={confirmarImportacion} disabled={guardando || guardado}>
              {guardado ? (
                <><CheckCircle2 className="h-4 w-4" /> Importado</>
              ) : guardando ? (
                "Guardando..."
              ) : (
                "Confirmar importación"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
