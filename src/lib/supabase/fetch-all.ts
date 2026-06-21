import type { SupabaseClient } from "@supabase/supabase-js";

// Supabase (PostgREST) tiene un límite de filas por respuesta a nivel de
// proyecto (1000 por defecto) que no se puede saltar solo con .limit() del
// lado del cliente. Esta función pide los datos en tandas de 1000 hasta
// que no queden más filas, y junta todo en un solo array.
export async function fetchAllRows<T = any>(
  builder: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: any }>
): Promise<T[]> {
  const pageSize = 1000;
  let all: T[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await builder(from, from + pageSize - 1);
    if (error) {
      console.error("fetchAllRows error:", error);
      break;
    }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return all;
}
