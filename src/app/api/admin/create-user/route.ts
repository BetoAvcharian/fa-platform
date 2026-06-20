import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  // 1) Verificar que quien llama está logueado y es admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: yo } = await supabase.from("usuarios").select("rol").eq("id", user.id).single();
  if (yo?.rol !== "admin") {
    return NextResponse.json({ error: "Solo un Admin puede crear usuarios" }, { status: 403 });
  }

  const { email, password, nombre, apellido, rol, manager_id } = await req.json();

  if (!email || !password || !nombre || !apellido) {
    return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
  }
  if (!["admin", "manager", "fa"].includes(rol)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  // 2) Crear el usuario con la API de administración (no afecta la sesión actual)
  const admin = createAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, apellido },
  });

  if (error || !created.user) {
    return NextResponse.json({ error: error?.message ?? "No se pudo crear el usuario" }, { status: 400 });
  }

  // 3) El trigger crea la fila en public.usuarios con rol 'fa' por defecto -> actualizamos al rol elegido
  await new Promise((r) => setTimeout(r, 400));
  await supabase
    .from("usuarios")
    .update({ rol, manager_id: manager_id || null })
    .eq("id", created.user.id);

  return NextResponse.json({ ok: true, id: created.user.id });
}
