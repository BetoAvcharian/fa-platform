"use client";

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { formatUSD } from "@/lib/utils";

interface ParetoPoint {
  nombre: string;
  valor: number;
  acumuladoPct: number;
}

export function ParetoChart({ data }: { data: ParetoPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="nombre"
          tick={{ fontSize: 10 }}
          stroke="hsl(var(--muted-foreground))"
          angle={-35}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis yAxisId="valor" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(38 92% 50%)" tickFormatter={(v) => `${v}%`} />
        <Tooltip
          formatter={(value: number, name: string) => (name === "Acumulado %" ? `${value.toFixed(1)}%` : formatUSD(value))}
          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
        />
        <Bar yAxisId="valor" dataKey="valor" name="Valor" fill="hsl(160 84% 39%)" radius={[3, 3, 0, 0]} />
        <Line yAxisId="pct" type="monotone" dataKey="acumuladoPct" name="Acumulado %" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ r: 3 }} />
        <ReferenceLine yAxisId="pct" y={80} stroke="hsl(0 72% 51%)" strokeDasharray="4 4" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
