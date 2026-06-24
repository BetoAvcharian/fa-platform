"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FilaActividad {
  id: string;
  fecha: string;
  tipo: string;
  asunto: string | null;
  detalle: string | null;
  cliente_id: string | null;
  cliente_nombre: string;
}

export function ActividadFeed({ filas }: { filas: FilaActividad[] }) {
  const [busqueda, setBusqueda] = useState("");

  const filtradas = useMemo(() => {
    if (!busqueda) return filas;
    return filas.filter((f) => f.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }, [filas, busqueda]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="max-w-xs"
      />
      <div className="space-y-2">
        {filtradas.slice(0, 300).map((f) => (
          <Card key={f.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Link href={f.cliente_id ? `/clientes/${f.cliente_id}` : "#"} className="font-medium hover:text-accent">
                  {f.cliente_nombre}
                </Link>
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="capitalize">{f.tipo}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(f.fecha).toLocaleString("es-AR")}</span>
                </div>
              </div>
              {f.asunto && <p className="mt-1 text-sm font-medium">{f.asunto}</p>}
              {f.detalle && <p className="text-sm text-muted-foreground">{f.detalle}</p>}
            </CardContent>
          </Card>
        ))}
        {filtradas.length === 0 && <p className="py-12 text-center text-muted-foreground">Sin actividad registrada.</p>}
      </div>
    </div>
  );
}
