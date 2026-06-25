import { Sparkles, ArrowRight, Wand2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const SWATCHES = [
  { name: "Canvas", value: "#0A0A0B", className: "bg-canvas ring-1 ring-hairline" },
  { name: "Surface", value: "#131316", className: "bg-surface" },
  { name: "Raised", value: "#1C1C20", className: "bg-surface-raised" },
  { name: "Overlay", value: "#25252B", className: "bg-surface-overlay" },
  { name: "Brand", value: "#7C3AED", className: "bg-brand" },
  { name: "Electric", value: "#3B82F6", className: "bg-electric" },
  { name: "Scan", value: "#22D3EE", className: "bg-scan" },
  { name: "Success", value: "#10B981", className: "bg-success" },
  { name: "Danger", value: "#EF4444", className: "bg-danger" },
];

export default function DesignSystemPreview() {
  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      {/* lueur d'ambiance */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-brand" />

      {/* barre du haut */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-spectrum shadow-glow-brand">
            <Wand2 className="h-4 w-4 text-white" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Photo<span className="text-gradient">Touch</span>
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          Design system · v0
        </span>
      </header>

      {/* hero */}
      <section className="animate-fade-up pt-16 sm:pt-24">
        <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted ring-1 ring-hairline">
          Étape 1 — Fondations
        </span>
        <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
          La base visuelle
          <br />
          de <span className="text-gradient">PhotoTouch</span>.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-ink-muted">
          Palette charbon, accents spectre électrique, et une signature de scan IA.
          Voici les tokens qui habilleront toute l&apos;app.
        </p>

        <div className="mt-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-success ring-1 ring-success/30">
            <Sparkles className="h-4 w-4" /> Gratuit pendant 7 jours
          </span>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button size="lg">
            Commencer gratuitement <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="secondary">
            Voir une démo
          </Button>
        </div>
      </section>

      {/* signature — scan IA */}
      <section className="mt-20">
        <SectionLabel index="01" title="Signature — Scan IA" />
        <div className="mt-5 grid gap-5 sm:grid-cols-[1.1fr_1fr]">
          <ScanCard />
          <div className="flex flex-col justify-center gap-4 rounded-3xl bg-surface p-6 ring-1 ring-hairline">
            <p className="text-sm leading-relaxed text-ink-muted">
              Le faisceau de scan, la grille et les réticules d&apos;angle reviennent
              à chaque transformation : sur le hero, pendant l&apos;analyse, et autour
              des résultats. C&apos;est l&apos;élément qu&apos;on retient.
            </p>
            <div className="flex items-center gap-2 text-sm text-ink-faint">
              <ShieldCheck className="h-4 w-4 text-success" />
              Chaque image passe par la modération avant d&apos;être affichée.
            </div>
          </div>
        </div>
      </section>

      {/* palette */}
      <section className="mt-16">
        <SectionLabel index="02" title="Palette" />
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {SWATCHES.map((s) => (
            <div key={s.name} className="space-y-2">
              <div className={`h-16 w-full rounded-2xl ${s.className}`} />
              <div className="px-0.5">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="font-mono text-xs text-ink-faint">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* typographie */}
      <section className="mt-16">
        <SectionLabel index="03" title="Typographie" />
        <div className="mt-5 space-y-4">
          <TypeRow tag="Display — Space Grotesk">
            <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Transforme tes photos en 1 clic
            </p>
          </TypeRow>
          <TypeRow tag="Body — Inter">
            <p className="max-w-xl text-base leading-relaxed text-ink-muted">
              Importe une photo, décris la retouche que tu veux, ajoute une image de
              référence si besoin. L&apos;IA s&apos;occupe du reste.
            </p>
          </TypeRow>
          <TypeRow tag="Mono — JetBrains Mono">
            <p className="font-mono text-sm text-scan">
              4 générations restantes · trial_ends_at = J-7
            </p>
          </TypeRow>
        </div>
      </section>

      {/* gradient & lueur */}
      <section className="mt-16">
        <SectionLabel index="04" title="Gradient & lueur" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-3xl ring-1 ring-hairline">
            <div className="h-28 w-full bg-spectrum" />
            <div className="bg-surface px-4 py-3 font-mono text-xs text-ink-faint">
              spectrum · #7C3AED → #3B82F6 → #22D3EE
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 rounded-3xl bg-surface p-6 ring-1 ring-hairline">
            <div className="h-16 w-16 rounded-2xl bg-brand shadow-glow-brand" />
            <div className="h-16 w-16 rounded-2xl bg-scan shadow-glow-scan" />
            <div className="h-16 w-16 rounded-2xl bg-spectrum shadow-glow-brand-lg" />
          </div>
        </div>
      </section>

      <footer className="mt-20 border-t border-hairline pt-6 font-mono text-xs text-ink-faint">
        Aperçu temporaire — remplacé par la vraie landing à l&apos;étape 3.
      </footer>
    </main>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-brand-bright">{index}</span>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}

function TypeRow({
  tag,
  children,
}: {
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface p-5 ring-1 ring-hairline">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        {tag}
      </p>
      {children}
    </div>
  );
}

function ScanCard() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-spectrum-soft ring-1 ring-hairline">
      {/* grille */}
      <div className="absolute inset-0 bg-grid-fade" />
      {/* sujet (placeholder) */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-28 w-28 animate-float rounded-full bg-white/5 ring-1 ring-white/10" />
      </div>
      {/* faisceau de scan */}
      <div className="absolute inset-0 animate-scan-y">
        <div className="h-20 w-full bg-gradient-to-b from-transparent via-scan/25 to-transparent" />
        <div className="h-px w-full bg-scan shadow-glow-scan" />
      </div>
      {/* réticules d'angle */}
      <span className="absolute left-3 top-3 h-5 w-5 border-l border-t border-scan/70" />
      <span className="absolute right-3 top-3 h-5 w-5 border-r border-t border-scan/70" />
      <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-scan/70" />
      <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-scan/70" />
      {/* readouts */}
      <div className="absolute left-10 top-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-scan">
        Analyse IA
      </div>
      <div className="absolute bottom-3.5 right-10 font-mono text-[11px] text-ink/80">
        98%
      </div>
    </div>
  );
}
