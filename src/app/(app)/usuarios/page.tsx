import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UsuariosTable } from "@/components/crm/usuarios-table";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: yo } = await supabase.from("usuarios").select("rol").eq("id", user?.id).single();

  if (yo?.rol !== "admin") {
    redirect("/dashboard");
  }

  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("*")
    .order("nombre", { ascending: true });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Usuarios y equipos</h1>
        <p className="text-sm text-muted-foreground">
          Asigná rol y manager a cada persona que se registre. Un "equipo" es un Manager + los FAs con ese Manager asignado.
        </p>
      </div>
      <UsuariosTable usuarios={usuarios ?? []} />
    </div>
  );
}
