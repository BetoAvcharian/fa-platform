import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSD(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumberAR(value: number, decimals = 2) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function diasDesde(fecha: string | null): number | null {
  if (!fecha) return null;
  const ms = Date.now() - new Date(fecha).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
