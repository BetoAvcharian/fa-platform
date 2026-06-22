"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { Upload, CheckCircle2, FileDown } from "lucide-react";
import { toast } from "sonner";

interface FilaCliente {
  tipo: string;
  nombre: string;
  apellido: string;
  documento: string;
  cuit_cuil: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  potencial_usd: number;
  referenciado_por: string;
  notas: string;
  comitentes: string[];
}

const COLUMNAS_TEMPLATE = [
  "Tipo", "Nombre", "Apellido", "Documento", "CuitCuil", "Email", "Telefono",
  "FechaNacimiento", "PotencialUSD", "ReferenciadoPor", "Notas",
  "Comitente1", "Comitente2", "Comitente3",
];

function normalizar(s: string) {
  return s.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function ImportadorClientes() {
  const [filas, setFilas] = useState<FilaCliente[]>([]);
  const [duplicados, setDuplicados] = useState<Set<number>>(new Set());
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const supabase = createClient();

  function descargarTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([
      COLUMNAS_TEMPLATE,
      ["prospecto", "Juan", "Pérez", "30111222", "20301112223", "juan@email.com", "+54 9 11 1234-5678", "1985-04-12", "150000", "Carlos Gómez", "Contactado en evento UTN", "12345", "", ""],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "template_clientes.xlsx");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGuardado(false);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });

      const json: FilaCliente[] = rawRows.map((row) => {
        const out: any = { tipo: "prospecto", comitentes: [] as string[] };
        for (const key of Object.keys(row)) {
          const norm = normalizar(key);
          if (norm.includes("tipo")) out.tipo = normalizar(row[key]).includes("cliente") ? "cliente" : "prospecto";
          else if (norm.includes("nombre") && !norm.includes("apellido")) out.nombre = row[key];
          else if (norm.includes("apellido")) out.apellido = row[key];
          else if (norm.includes("documento") || norm === "dni") out.documento = row[key];
          else if (norm.includes("cuit")) out.cuit_cuil = row[key];
          else if (norm.includes("email") || norm.includes("mail")) out.email = row[key];
          else if (norm.includes("telefono") || norm.includes("celular")) out.telefono = row[key];
          else if (norm.includes("nacimiento")) out.fecha_nacimiento = row[key];
          else if (norm.includes("potencial")) out.potencial_usd = Number(row[key]) || 0;
          else if (norm.includes("referenciado") || norm.includes("referido")) out.referenciado_por = row[key];
          else if (norm.includes("nota")) out.notas = row[key];
          else if (norm.includes("comitente") || norm.includes("cuenta")) {
            if (row[key] !== "" && row[key] !== undefined && row[key] !== null) {
              out.comitentes.push(String(row[key]));
            }
          }
        }
        return out;
      });

      const validas = json.filter((f) => f.nombre && String(f.nombre).trim() !== "");
      if (validas.length !== json.length) {
        toast.warning(`Se omitieron ${json.length - validas.length} filas sin nombre`);
      }
      setFilas(validas);
      await detectarDuplicados(validas);
    };
    reader.readAsBinaryString(file);
  }

  async function detectarDuplicados(filasActuales: FilaCliente[]) {
    const existentes = await fetchAllRows((from, to) =>
      supabase.from("clientes").select("documento, email").range(from, to)
    );
    const documentosExistentes = new Set(existentes.map((e) => (e.documento ?? "").trim().toLowerCase()).filter(Boolean));
    const emailsExistentes = new Set(existentes.map((e) => (e.email ?? "").trim().toLowerCase()).filter(Boolean));

    const vistosDoc = new Set<string>();
    const vistosEmail = new Set<string>();
    const dups = new Set<number>();

    filasActuales.forEach((f, i) => {
      const doc = (f.documento ?? "").trim().toLowerCase();
      const email = (f.email ?? "").trim().toLowerCase();
      const esDup =
        (doc && (documentosExistentes.has(doc) || vistosDoc.has(doc))) ||
        (email && (emailsExistentes.has(email) || vistosEmail.has(email)));
      if (esDup) dups.add(i);
      if (doc) vistosDoc.add(doc);
      if (email) vistosEmail.add(email);
    });

    setDuplicados(dups);
    if (dups.size > 0) {
      toast.warning(`${dups.size} fila(s) parecen duplicadas (mismo documento o email ya cargado) — no se van a importar salvo que las edites`);
    }
  }

  async function confirmarImportacion() {
    setGuardando(true);
    const { data: { user } } = await supabase.auth.getUser();

    const filasAImportar = filas.filter((_, i) => !duplicados.has(i));

    const registros = filasAImportar.map((f) => ({
      owner_id: user?.id,
      tipo: f.tipo || "prospecto",
      nombre: f.nombre,
      apellido: f.apellido || null,
      documento: f.documento || null,
      cuit_cuil: f.cuit_cuil || null,
      email: f.email || null,
      telefono: f.telefono || null,
      fecha_nacimiento: f.fecha_nacimiento || null,
      potencial_usd: f.potencial_usd || 0,
      referenciado_por: f.referenciado_por || null,
      notas: f.notas || null,
      estado: "activo",
    }));

    const { data: clientesCreados, error } = await supabase.from("clientes").insert(registros).select("id");
    setGuardando(false);

    if (error) {
      toast.error("Error al guardar: " + error.message);
      return;
    }

    // crear las cuentas (comitentes) vinculadas a cada cliente recién creado
    const cuentasParaInsertar: { numero_cuenta: string; estado_cuenta: string; clienteIdTemp: string }[] = [];
    (clientesCreados ?? []).forEach((c: any, i: number) => {
      const comitentes = filasAImportar[i]?.comitentes ?? [];
      comitentes.forEach((numero) => {
        cuentasParaInsertar.push({ numero_cuenta: numero, estado_cuenta: "activa", clienteIdTemp: c.id });
      });
    });

    let totalCuentas = 0;
    for (const c of cuentasParaInsertar) {
      const { data: cuentaCreada, error: errorCuenta } = await supabase
        .from("cuentas")
        .insert({ numero_cuenta: c.numero_cuenta, estado_cuenta: c.estado_cuenta })
        .select("id")
        .single();
      if (errorCuenta || !cuentaCreada) continue;
      const { error: errorTitular } = await supabase
        .from("cuenta_titulares")
        .insert({ cuenta_id: cuentaCreada.id, cliente_id: c.clienteIdTemp, rol_titular: "titular" });
      if (!errorTitular) totalCuentas++;
    }

    setGuardado(true);
    const omitidos = filas.length - filasAImportar.length;
    toast.success(`${registros.length} clientes cargados, ${totalCuentas} comitentes vinculados${omitidos > 0 ? ` (${omitidos} duplicados omitidos)` : ""}`);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Carga masiva de clientes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Descargá la plantilla, completala con tus clientes/prospectos, y subila. Solo Nombre es obligatorio.
            Las columnas <code className="text-xs">Comitente1</code>, <code className="text-xs">Comitente2</code>, <code className="text-xs">Comitente3</code> son opcionales —
            si las completás, se crea automáticamente una cuenta vinculada al cliente por cada una.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={descargarTemplate}>
              <FileDown className="h-4 w-4" /> Descargar plantilla
            </Button>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm hover:bg-muted">
              <Upload className="h-4 w-4" />
              Elegir archivo Excel
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
            </label>
          </div>
        </CardContent>
      </Card>

      {filas.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Vista previa ({filas.length} filas)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Table>
              <THead><TR><TH>Tipo</TH><TH>Nombre</TH><TH>Email</TH><TH>Teléfono</TH><TH>Potencial</TH><TH>Comitentes</TH><TH></TH></TR></THead>
              <TBody>
                {filas.slice(0, 20).map((f, i) => (
                  <TR key={i} className={duplicados.has(i) ? "bg-danger/5" : ""}>
                    <TD className="capitalize">{f.tipo}</TD>
                    <TD>{f.nombre} {f.apellido}</TD>
                    <TD>{f.email || "—"}</TD>
                    <TD>{f.telefono || "—"}</TD>
                    <TD className="tabular">{f.potencial_usd || 0}</TD>
                    <TD className="tabular">{f.comitentes.length > 0 ? f.comitentes.join(", ") : "—"}</TD>
                    <TD>{duplicados.has(i) && <span className="text-xs text-danger">Duplicado</span>}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            {filas.length > 20 && <p className="text-xs text-muted-foreground">...y {filas.length - 20} filas más</p>}
            {duplicados.size > 0 && (
              <p className="text-xs text-danger">
                {duplicados.size} fila(s) marcadas como duplicado no se van a importar (mismo documento o email que uno ya cargado).
              </p>
            )}
            <Button onClick={confirmarImportacion} disabled={guardando || guardado}>
              {guardado ? <><CheckCircle2 className="h-4 w-4" /> Importado</> : guardando ? "Guardando..." : "Confirmar importación"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
