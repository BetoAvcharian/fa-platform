"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, User, Gavel, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ResultadoCliente { id: string; nombre: string; apellido: string | null; tipo: string }
interface ResultadoLicitacion { id: string; nombre: string }

export function GlobalSearch() {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [clientes, setClientes] = useState<ResultadoCliente[]>([]);
  const [licitaciones, setLicitaciones] = useState<ResultadoLicitacion[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setClientes([]);
      setLicitaciones([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const [clientesRes, licitacionesRes] = await Promise.all([
        supabase.from("clientes").select("id, nombre, apellido, tipo").or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%`).limit(6),
        supabase.from("licitaciones").select("id, nombre").ilike("nombre", `%${query}%`).limit(4),
      ]);
      setClientes(clientesRes.data ?? []);
      setLicitaciones(licitacionesRes.data ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const hayResultados = clientes.length > 0 || licitaciones.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar cliente o licitación..."
          className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          {!hayResultados && (
            <p className="px-3 py-3 text-sm text-muted-foreground">Sin resultados para "{query}"</p>
          )}
          {clientes.length > 0 && (
            <div className="border-b border-border py-1">
              <p className="px-3 py-1 text-xs text-muted-foreground">Clientes / Prospectos</p>
              {clientes.map((c) => (
                <Link
                  key={c.id}
                  href={`/clientes/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {c.nombre} {c.apellido}
                  <span className="ml-auto text-xs capitalize text-muted-foreground">{c.tipo}</span>
                </Link>
              ))}
            </div>
          )}
          {licitaciones.length > 0 && (
            <div className="py-1">
              <p className="px-3 py-1 text-xs text-muted-foreground">Licitaciones</p>
              {licitaciones.map((l) => (
                <Link
                  key={l.id}
                  href={`/licitaciones/${l.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Gavel className="h-3.5 w-3.5 text-muted-foreground" />
                  {l.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
