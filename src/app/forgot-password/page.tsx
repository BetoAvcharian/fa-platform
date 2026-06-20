"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [paso, setPaso] = useState<"email" | "codigo">("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificado, setVerificado] = useState(false);

  async function handlePedirCodigo(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setPaso("codigo");
  }

  async function handleVerificarYCambiar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!verificado) {
      const { error } = await supabase.auth.verifyOtp({ email, token: codigo, type: "recovery" });
      if (error) {
        setLoading(false);
        setError("Código incorrecto o vencido.");
        return;
      }
      setVerificado(true);
    }

    const { error: errorUpdate } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (errorUpdate) {
      setError(errorUpdate.message);
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
          <h1 className="text-lg font-semibold text-sidebar-foreground">Recuperar contraseña</h1>
        </div>

        {paso === "email" && (
          <form onSubmit={handlePedirCodigo} className="space-y-3 rounded-lg border border-white/10 bg-card p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Enviar código"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <Link href="/login" className="text-accent hover:underline">Volver al login</Link>
            </p>
          </form>
        )}

        {paso === "codigo" && (
          <form onSubmit={handleVerificarYCambiar} className="space-y-3 rounded-lg border border-white/10 bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Te enviamos un código a <strong>{email}</strong>. Ingresalo junto con tu nueva contraseña.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Código</label>
              <Input required maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value)} className="text-center tracking-widest" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Nueva contraseña</label>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
