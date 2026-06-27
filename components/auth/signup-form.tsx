"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const inputClass =
  "w-full rounded-xl bg-surface-raised px-4 py-3 text-ink ring-1 ring-hairline placeholder:text-ink-faint transition focus:outline-none focus:ring-2 focus:ring-brand-bright/70";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4 5.6l6.3 5.2C41.3 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.466 2.22-1.222 3.01-.81.85-2.13 1.51-3.23 1.42-.13-1.09.44-2.25 1.17-3 .8-.83 2.2-1.45 3.28-1.43zM20.5 17.3c-.6 1.38-.88 2-1.66 3.22-1.08 1.7-2.6 3.82-4.48 3.83-1.67.02-2.1-1.08-4.37-1.07-2.27.01-2.74 1.09-4.41 1.08-1.88-.02-3.32-1.93-4.4-3.62C-1.1 17.07-.3 9.9 3.46 9.62c1.34-.07 2.28.86 3.06.86.78 0 2.18-1.06 3.68-.9.63.03 2.39.26 3.52 1.92-3.1 1.9-2.61 6.32.78 7.8z" />
    </svg>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }
    track("signup_completed");
    fetch("/api/welcome", { method: "POST" }).catch(() => {});
    if (data.session) {
      router.push("/create");
      router.refresh();
      return;
    }
    setInfo(
      "Compte créé ! Vérifie ton email pour confirmer, puis reviens pour démarrer ton essai gratuit.",
    );
  }

  async function oauth(provider: "google" | "apple") {
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (err) setError(err.message);
  }

  const oauthBtn =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-surface-raised px-4 py-3 text-sm font-medium ring-1 ring-hairline transition hover:bg-surface-overlay";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => oauth("google")} className={oauthBtn}>
          <GoogleIcon /> Google
        </button>
        <button type="button" onClick={() => oauth("apple")} className={oauthBtn}>
          <AppleIcon /> Apple
        </button>
      </div>

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
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="8 caractères minimum"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {info && (
        <p role="status" className="text-sm text-success">
          {info}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Création…" : "Créer mon compte gratuit"}
      </Button>

      <p className="text-center text-xs leading-relaxed text-ink-faint">
        En continuant, tu acceptes les{" "}
        <a href="/cgu" className="text-ink-muted underline hover:text-ink">
          CGU
        </a>{" "}
        et la{" "}
        <a
          href="/confidentialite"
          className="text-ink-muted underline hover:text-ink"
        >
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}
