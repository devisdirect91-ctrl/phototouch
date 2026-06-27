"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

const inputClass =
  "w-full rounded-xl bg-surface-raised px-4 py-3 text-ink ring-1 ring-hairline placeholder:text-ink-faint transition focus:outline-none focus:ring-2 focus:ring-brand-bright/70";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/create");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <OAuthButtons />

      <div className="flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-hairline" /> ou
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-ink-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="toi@exemple.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-ink-muted">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Ton mot de passe"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Connexion…" : "Se connecter"}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        Pas encore de compte ?{" "}
        <Link href="/auth/signup" className="text-scan hover:opacity-80">
          Crée-en un
        </Link>
      </p>
    </form>
  );
}
