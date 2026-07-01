"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatUSD } from "@/lib/utils";

interface PuntoEvolucion {
  fecha: string;
  total: number;
}

export function EvolucionComisionesChart({ data }: { data: PuntoEvolucion[] }) {
  if (data.length < 2) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Necesitás al menos 2 meses cargados para ver la evolución.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1e3).toFixed(0)}k`} />
        <Tooltip
          formatter={(v: number) => [formatUSD(v), "Comisiones"]}
          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="total" name="Comisiones" fill="hsl(38 92% 50%)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
