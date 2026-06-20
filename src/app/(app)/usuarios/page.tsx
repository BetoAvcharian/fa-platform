import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UsuariosTable } from "@/components/crm/usuarios-table";
import { NuevoUsuarioDialog } from "@/components/crm/nuevo-usuario-dialog";

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

  const managers = (usuarios ?? []).filter((u) => u.rol === "manager" || u.rol === "admin");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Usuarios y equipos</h1>
          <p className="text-sm text-muted-foreground">
            Crear, asignar rol/equipo, y eliminar usuarios. Solo accesible para Admin.
          </p>
        </div>
        <NuevoUsuarioDialog managers={managers} />
      </div>
      <UsuariosTable usuarios={usuarios ?? []} miPropioId={user!.id} />
    </div>
  );
}
