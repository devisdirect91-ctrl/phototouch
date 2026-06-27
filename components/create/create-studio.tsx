"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wand2, Loader2 } from "lucide-react";
import { ImageDrop } from "@/components/create/image-drop";
import { Button } from "@/components/ui/button";
import { PROMPT_SUGGESTIONS } from "@/lib/constants";
import { setPendingGeneration } from "@/lib/generation-store";
import { track } from "@/lib/analytics";

export function CreateStudio({ isPremium }: { isPremium: boolean }) {
  const [source, setSource] = useState<File | null>(null);
  const [reference, setReference] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const canGenerate = !!source && prompt.trim().length > 0 && !busy;

  function addSuggestion(s: string) {
    setPrompt((p) =>
      p.trim() ? `${p.replace(/[,\s]+$/, "")}, ${s.toLowerCase()}` : s,
    );
  }

  function generate() {
    setError(null);
    if (!source) {
      setError("Importe d'abord une photo.");
      return;
    }
    if (!prompt.trim()) {
      setError("Décris la transformation que tu veux.");
      return;
    }
    track("generation_started");
    setPendingGeneration({ source, reference, prompt: prompt.trim() });
    setBusy(true);
    router.push("/processing");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Crée ta transformation
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Une photo, une description. L&apos;IA fait le reste.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface px-3 py-1.5 font-mono text-xs text-ink-muted ring-1 ring-hairline">
          {isPremium ? "∞ illimité" : "Gratuit"}
        </span>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <StepLabel n="1" title="Ta photo" />
          <ImageDrop
            label="Importe la photo à transformer"
            hint="Glisse-dépose ou clique"
            value={source}
            onChange={setSource}
            onError={setError}
          />
        </section>

        <section>
          <StepLabel n="2" title="Ta retouche" />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Décris ce que tu veux changer… ex : « remplace le fond par une plage au coucher du soleil »"
            className="w-full resize-none rounded-2xl bg-surface-raised px-4 py-3 text-ink ring-1 ring-hairline placeholder:text-ink-faint transition focus:outline-none focus:ring-2 focus:ring-brand-bright/70"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSuggestion(s)}
                className="rounded-full bg-surface px-3 py-1.5 text-sm text-ink-muted ring-1 ring-hairline transition hover:bg-surface-raised hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section>
          <StepLabel n="3" title="Référence (optionnel)" />
          <ImageDrop
            label="Ajoute une image de référence"
            hint="Pour guider le style ou le rendu"
            value={reference}
            onChange={setReference}
            onError={setError}
            compact
          />
        </section>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <div className="pt-1">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={generate}
            disabled={!canGenerate}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Générer
          </Button>
          <p className="mt-3 text-center text-xs text-ink-faint">
            {isPremium
              ? "Générations illimitées."
              : "Ta première transformation est offerte ✨"}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-spectrum-soft font-mono text-xs text-scan ring-1 ring-hairline">
        {n}
      </span>
      <h2 className="font-display text-lg font-semibold tracking-tight">
        {title}
      </h2>
    </div>
  );
}
