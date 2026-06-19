"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatUSD } from "@/lib/utils";

export function AumChart({ data }: { data: { fecha: string; aum: number }[] }) {
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
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
        />
        <Tooltip
          formatter={(value: number) => formatUSD(value)}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Area type="monotone" dataKey="aum" stroke="hsl(160 84% 39%)" fill="url(#aumGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
