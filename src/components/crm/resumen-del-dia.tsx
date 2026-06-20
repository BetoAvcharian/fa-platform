"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { diasDesde } from "@/lib/utils";
import { PhoneCall, Check } from "lucide-react";
import { toast } from "sonner";

interface ClienteRow {
  id: string;
  nombre: string;
  apellido: string | null;
  fecha_ultimo_contacto: string | null;
}

export function ResumenDelDia({ clientes }: { clientes: ClienteRow[] }) {
  const [search, setSearch] = useState("");
  const [hoyHablados, setHoyHablados] = useState<Set<string>>(new Set());
  const router = useRouter();
  const supabase = createClient();

  const filtrados = useMemo(() => {
    return clientes
      .filter((c) => `${c.nombre} ${c.apellido ?? ""}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (diasDesde(b.fecha_ultimo_contacto) ?? 9999) - (diasDesde(a.fecha_ultimo_contacto) ?? 9999));
  }, [clientes, search]);

  async function marcarHablado(clienteId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const hoy = new Date().toISOString().slice(0, 10);

    const { error: e1 } = await supabase.from("interacciones").insert({
      cliente_id: clienteId,
      usuario_id: user?.id,
      tipo: "llamada",
      asunto: "Contacto diario",
      detalle: "Registrado desde Resumen del día",
      fecha: new Date().toISOString(),
    });
    const { error: e2 } = await supabase.from("clientes").update({ fecha_ultimo_contacto: hoy }).eq("id", clienteId);

    if (e1 || e2) {
      toast.error("Error al registrar el contacto");
      return;
    }
    setHoyHablados((prev) => new Set(prev).add(clienteId));
    toast.success("Contacto registrado");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del día — ¿con quién hablaste?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="max-h-96 space-y-1.5 overflow-y-auto">
          {filtrados.map((c) => {
            const yaHablado = hoyHablados.has(c.id) || diasDesde(c.fecha_ultimo_contacto) === 0;
            return (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{c.nombre} {c.apellido}</p>
                  <p className="text-xs text-muted-foreground">
                    Último contacto: {diasDesde(c.fecha_ultimo_contacto) ?? "—"} días
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={yaHablado ? "subtle" : "outline"}
                  disabled={yaHablado}
                  onClick={() => marcarHablado(c.id)}
                >
                  {yaHablado ? <><Check className="h-3.5 w-3.5" /> Hablé hoy</> : <><PhoneCall className="h-3.5 w-3.5" /> Marcar</>}
                </Button>
              </div>
            );
          })}
          {filtrados.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Sin resultados.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
