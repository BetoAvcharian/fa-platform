import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente de administración — usa la service_role key.
// SOLO se importa desde código de servidor (API routes / Server Actions).
// Nunca debe usarse desde un componente cliente.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
