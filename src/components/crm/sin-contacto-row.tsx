"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { diasDesde } from "@/lib/utils";
import Link from "next/link";

interface ClienteRow {
  id: string;
  nombre: string;
  apellido: string | null;
  fecha_ultimo_contacto: string | null;
}

export function SinContactoRow({ label, clientes, tone }: { label: string; clientes: ClienteRow[]; tone: "warning" | "danger" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-md px-1 py-0.5 hover:bg-muted">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Badge variant={tone}>{clientes.length}</Badge>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{label}</DialogTitle></DialogHeader>
        <div className="max-h-96 space-y-1.5 overflow-y-auto">
          {clientes.map((c) => (
            <Link
              key={c.id}
              href={`/clientes/${c.id}`}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 hover:bg-muted"
            >
              <span className="text-sm">{c.nombre} {c.apellido}</span>
              <Badge variant={tone}>{diasDesde(c.fecha_ultimo_contacto)} días</Badge>
            </Link>
          ))}
          {clientes.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">Sin clientes en este rango.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
