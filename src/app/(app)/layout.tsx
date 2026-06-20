import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { GlobalSearch } from "@/components/layout/global-search";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nombre, apellido, rol")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      <Sidebar
        nombre={usuario ? `${usuario.nombre} ${usuario.apellido}` : user.email ?? ""}
        rol={usuario?.rol ?? "fa"}
      />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="border-b border-border px-4 py-2.5 sm:px-6">
          <GlobalSearch />
        </div>
        <div className="mx-auto max-w-7xl p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
