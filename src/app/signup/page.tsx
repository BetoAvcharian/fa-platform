"use client";
import { Logo } from "@/components/ui/logo";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const supabase = createClient();
  const [enviado, setEnviado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, apellido },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEnviado(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground font-semibold">
            <Logo className="h-6 w-6 text-accent-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Crear cuenta</h1>
          <p className="text-sm text-sidebar-foreground/60">TIT CRM</p>
        </div>

        {!enviado ? (
          <form onSubmit={handleSignup} className="space-y-3 rounded-lg border border-white/10 bg-card p-6">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nombre</label>
                <Input required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Apellido</label>
                <Input required value={apellido} onChange={(e) => setApellido(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              ¿Ya tenés cuenta? <Link href="/login" className="text-accent hover:underline">Ingresá</Link>
            </p>
          </form>
        ) : (
          <div className="space-y-3 rounded-lg border border-white/10 bg-card p-6 text-center">
            <p className="text-sm">
              Te enviamos un mail a <strong>{email}</strong>. Abrilo y hacé click en el link de confirmación para activar tu cuenta.
            </p>
            <Link href="/login" className="text-sm text-accent hover:underline">Volver al login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
