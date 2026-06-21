"use client";

import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { formatUSD } from "@/lib/utils";

export function AumChart({ data }: { data: { fecha: string; aum: number | null; comisiones: number | null }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis
          yAxisId="aum"
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
        />
        <YAxis
          yAxisId="comisiones"
          orientation="right"
          tick={{ fontSize: 11 }}
          stroke="hsl(38 92% 50%)"
          tickFormatter={(v) => `${(v / 1e3).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatUSD(value), name]}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          yAxisId="aum"
          type="monotone"
          dataKey="aum"
          name="AUM"
          stroke="hsl(160 84% 39%)"
          fill="url(#aumGradient)"
          strokeWidth={2}
          connectNulls
        />
        <Line
          yAxisId="comisiones"
          type="monotone"
          dataKey="comisiones"
          name="Comisiones"
          stroke="hsl(38 92% 50%)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
