"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClienteOption {
  id: string;
  nombre: string;
  apellido?: string | null;
}

export function ClienteMultiCombobox({
  clientes,
  value,
  onChange,
  placeholder = "Sin clientes asociados",
}: {
  clientes: ClienteOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const seleccionados = clientes.filter((c) => value.includes(c.id));

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
    .filter((c) => !value.includes(c.id))
    .filter((c) => `${c.nombre} ${c.apellido ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 50);

  function agregar(id: string) {
    onChange([...value, id]);
    setQuery("");
  }

  function quitar(id: string) {
    onChange(value.filter((v) => v !== id));
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setOpen(true)}
        className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-sm cursor-text"
      >
        {seleccionados.map((c) => (
          <span key={c.id} className="flex items-center gap-1 rounded bg-accent/15 px-2 py-0.5 text-xs text-accent">
            {c.nombre} {c.apellido}
            <button type="button" onClick={(e) => { e.stopPropagation(); quitar(c.id); }}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={seleccionados.length === 0 ? placeholder : "Agregar otro..."}
          className="min-w-[80px] flex-1 bg-transparent text-sm outline-none"
        />
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          <div className="max-h-60 overflow-y-auto py-1">
            {filtrados.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => agregar(c.id)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {c.nombre} {c.apellido}
              </button>
            ))}
            {filtrados.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>}
          </div>
        </div>
      )}
    </div>
  );
}
