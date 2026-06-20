"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [paso, setPaso] = useState<"datos" | "codigo">("datos");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setPaso("codigo");
  }

  async function handleVerificar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({ email, token: codigo, type: "signup" });

    setLoading(false);
    if (error) {
      setError("Código incorrecto o vencido.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground font-semibold">
            FA
          </div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Crear cuenta</h1>
          <p className="text-sm text-sidebar-foreground/60">FA Platform</p>
        </div>

        {paso === "datos" && (
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
        )}

        {paso === "codigo" && (
          <form onSubmit={handleVerificar} className="space-y-3 rounded-lg border border-white/10 bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Te enviamos un código de 6 dígitos a <strong>{email}</strong>. Ingresalo abajo para activar tu cuenta.
            </p>
            <Input
              required
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="123456"
              className="text-center text-lg tracking-widest"
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verificando..." : "Verificar y entrar"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
