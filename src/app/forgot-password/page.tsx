"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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
            TIT
          </div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Recuperar contraseña</h1>
        </div>

        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-white/10 bg-card p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Enviar link"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <Link href="/login" className="text-accent hover:underline">Volver al login</Link>
            </p>
          </form>
        ) : (
          <div className="space-y-3 rounded-lg border border-white/10 bg-card p-6 text-center">
            <p className="text-sm">
              Te enviamos un mail a <strong>{email}</strong>. Abrilo y hacé click en el link para elegir tu nueva contraseña.
            </p>
            <Link href="/login" className="text-sm text-accent hover:underline">Volver al login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
