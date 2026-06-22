"use client";
import { Logo } from "@/components/ui/logo";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
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
            <Logo className="h-6 w-6 text-accent-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Elegí tu nueva contraseña</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-white/10 bg-card p-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nueva contraseña</label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </Button>
        </form>
      </div>
    </div>
  );
}
