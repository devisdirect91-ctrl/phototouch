"use client";

import { useEffect, useState } from "react";
import { Sparkles, Lock, Check, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_BENEFITS, type PlanId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function Paywall({
  previewSrc,
  generationId,
}: {
  previewSrc: string;
  generationId: string;
}) {
  const [plan, setPlan] = useState<PlanId>("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    track("paywall_viewed");
  }, []);

  async function checkout() {
    setLoading(true);
    setError(null);
    track("checkout_initiated", { plan });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, generationId }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Le paiement Stripe sera actif à l'étape 10.");
    } catch {
      setError("Le paiement Stripe sera actif à l'étape 10.");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md px-5 py-8">
      {/* Résultat flouté + cadenas */}
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-3xl ring-1 ring-hairline">
        {previewSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt=""
            className="h-full w-full scale-110 object-cover blur-xl"
          />
        )}
        <div className="absolute inset-0 bg-canvas/40" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-canvas/70 text-ink ring-1 ring-white/10 backdrop-blur">
            <Lock className="h-6 w-6" />
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-success ring-1 ring-success/30">
          <Sparkles className="h-4 w-4" /> 7 jours gratuits
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
          Commence gratuitement
        </h1>
        <p className="mt-2 text-ink-muted">
          Découvre ton image transformée. Gratuit pendant 7 jours, sans
          engagement.
        </p>
      </div>

      <ul className="mt-6 space-y-2.5">
        {PLAN_BENEFITS.map((b) => (
          <li key={b} className="flex items-center gap-2.5 text-sm text-ink">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
              <Check className="h-3 w-3" />
            </span>
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlan(p.id)}
            className={cn(
              "relative rounded-2xl p-4 text-left ring-1 transition",
              plan === p.id
                ? "bg-surface-raised ring-brand-bright"
                : "bg-surface ring-hairline hover:ring-white/15",
            )}
          >
            {p.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-spectrum px-2 py-0.5 text-[10px] font-semibold text-white">
                {p.badge}
              </span>
            )}
            <p className="text-sm text-ink-muted">{p.label}</p>
            <p className="mt-1 font-display text-lg font-bold">
              Aujourd&apos;hui&nbsp;: 0&nbsp;€
            </p>
            <p className="text-xs text-ink-faint">
              puis {p.price}
              {p.period}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={checkout}
          disabled={loading}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Commencer gratuitement
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
        {error && (
          <p className="mt-2 text-center text-xs text-ink-faint">{error}</p>
        )}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-faint">
        <ShieldCheck className="h-4 w-4 text-success" /> Paiement sécurisé Stripe ·
        annulable en 1 clic
      </p>
    </div>
  );
}
