"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, LogOut, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AccountActions({ hasCustomer }: { hasCustomer: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function billing() {
    setLoading("billing");
    setError(null);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Indisponible pour le moment.");
    } catch {
      setError("Erreur réseau.");
    }
    setLoading(null);
  }

  async function signOut() {
    setLoading("signout");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function deleteAccount() {
    if (
      !window.confirm(
        "Supprimer définitivement ton compte et toutes tes données ? Cette action est irréversible.",
      )
    ) {
      return;
    }
    setLoading("delete");
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (res.ok) {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "La suppression a échoué.");
    } catch {
      setError("Erreur réseau.");
    }
    setLoading(null);
  }

  return (
    <div className="space-y-3">
      {hasCustomer && (
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={billing}
          disabled={loading !== null}
        >
          {loading === "billing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          Gérer mon abonnement
        </Button>
      )}

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={signOut}
        disabled={loading !== null}
      >
        <LogOut className="h-4 w-4" /> Se déconnecter
      </Button>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="button"
        onClick={deleteAccount}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-50"
      >
        {loading === "delete" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        Supprimer mon compte
      </button>
    </div>
  );
}
