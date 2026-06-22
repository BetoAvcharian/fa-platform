"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClienteOption {
  id: string;
  nombre: string;
  apellido?: string | null;
}

export function ClienteCombobox({
  clientes,
  value,
  onChange,
  placeholder = "Buscar cliente...",
  className,
  permitirVacio = true,
}: {
  clientes: ClienteOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
  permitirVacio?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const seleccionado = clientes.find((c) => c.id === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtrados = clientes
    .filter((c) => `${c.nombre} ${c.apellido ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 50);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => { setOpen(true); setQuery(""); }}
        className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-sm"
      >
        <span className={seleccionado ? "" : "text-muted-foreground"}>
          {seleccionado ? `${seleccionado.nombre} ${seleccionado.apellido ?? ""}` : placeholder}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          <div className="flex items-center border-b border-border px-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribí para buscar..."
              className="h-9 w-full bg-transparent text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {permitirVacio && (
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); setQuery(""); }}
                className="block w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
              >
                Sin cliente
              </button>
            )}
            {filtrados.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { onChange(c.id); setOpen(false); setQuery(""); }}
                className={cn(
                  "block w-full px-3 py-2 text-left text-sm hover:bg-muted",
                  c.id === value && "bg-accent/10 text-accent"
                )}
              >
                {c.nombre} {c.apellido}
              </button>
            ))}
            {filtrados.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
