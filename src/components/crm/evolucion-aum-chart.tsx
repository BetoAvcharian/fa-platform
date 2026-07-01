"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatUSD } from "@/lib/utils";

interface PuntoEvolucion {
  fecha: string;
  total: number;
}

export function EvolucionAumChart({ data }: { data: PuntoEvolucion[] }) {
  if (data.length < 2) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Necesitás al menos 2 cierres de mes cargados para ver la evolución.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
        <Tooltip
          formatter={(v: number) => [formatUSD(v), "AUM total"]}
          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
        />
        <Line type="monotone" dataKey="total" name="AUM total" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
