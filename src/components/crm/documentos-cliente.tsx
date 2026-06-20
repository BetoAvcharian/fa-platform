"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ArchivoItem {
  name: string;
  id: string;
  created_at: string;
  metadata: { size: number };
}

const BUCKET = "documentos-clientes";

export function DocumentosCliente({ clienteId }: { clienteId: string }) {
  const supabase = createClient();
  const [archivos, setArchivos] = useState<ArchivoItem[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [cargando, setCargando] = useState(true);

  async function cargarArchivos() {
    setCargando(true);
    const { data, error } = await supabase.storage.from(BUCKET).list(clienteId, {
      sortBy: { column: "created_at", order: "desc" },
    });
    if (!error) setArchivos((data ?? []) as ArchivoItem[]);
    setCargando(false);
  }

  useEffect(() => {
    cargarArchivos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);

    const path = `${clienteId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);

    setSubiendo(false);
    if (error) {
      toast.error("Error al subir: " + error.message);
      return;
    }
    toast.success("Archivo subido");
    cargarArchivos();
  }

  async function descargar(nombreArchivo: string) {
    const path = `${clienteId}/${nombreArchivo}`;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
    if (error || !data) {
      toast.error("No se pudo generar el link de descarga");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  async function eliminar(nombreArchivo: string) {
    const path = `${clienteId}/${nombreArchivo}`;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      toast.error("Error al borrar: " + error.message);
      return;
    }
    toast.success("Archivo eliminado");
    cargarArchivos();
  }

  function formatSize(bytes: number) {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  function nombreLimpio(name: string) {
    // quita el timestamp_ que le pusimos al subir
    return name.replace(/^\d+_/, "");
  }

  return (
    <div className="space-y-3">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm hover:bg-muted">
        <Upload className="h-4 w-4" />
        {subiendo ? "Subiendo..." : "Subir archivo"}
        <input type="file" className="hidden" onChange={handleUpload} disabled={subiendo} />
      </label>

      <div className="space-y-1.5">
        {cargando && <p className="text-sm text-muted-foreground">Cargando...</p>}
        {!cargando && archivos.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">Sin archivos subidos para este cliente.</p>
        )}
        {archivos.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm">{nombreLimpio(a.name)}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{formatSize(a.metadata?.size)}</span>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" onClick={() => descargar(a.name)}>
                <Download className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => eliminar(a.name)}>
                <Trash2 className="h-3.5 w-3.5 text-danger" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
