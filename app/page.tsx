import Link from "next/link";
import {
  Upload,
  MessageSquareText,
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/landing/hero";
import { BeforeAfter } from "@/components/landing/before-after";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { PROMPT_SUGGESTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Upload,
    title: "Importe ta photo",
    desc: "Glisse l'image que tu veux transformer. JPG ou PNG, depuis ton téléphone.",
  },
  {
    icon: MessageSquareText,
    title: "Décris ta retouche",
    desc: "« Change le fond », « style cinématique »… écris-le simplement, en français.",
  },
  {
    icon: Sparkles,
    title: "L'IA génère",
    desc: "En quelques secondes, ta nouvelle image est prête. Télécharge en HD.",
  },
];

// Témoignages illustratifs — à remplacer par de vrais avis.
const TESTIMONIALS = [
  { quote: "Bluffé. J'ai changé le fond de ma photo en 2 secondes.", name: "Maxime", meta: "19 ans" },
  { quote: "Mes photos Insta sont passées au niveau supérieur.", name: "Tom", meta: "22 ans" },
  { quote: "Simple, rapide, et le rendu est juste dingue.", name: "Yanis", meta: "17 ans" },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* Aperçu / preuve */}
        <section id="showcase" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading
                eyebrow="Aperçu"
                title="Vois la différence"
                subtitle="Glisse pour comparer. Le même cliché, transformé par un simple prompt."
              />
            </Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <Reveal>
                <BeforeAfter />
              </Reveal>
              <Reveal delay={0.1}>
                <div>
                  <p className="text-lg leading-relaxed text-ink-muted">
                    Pas de réglages compliqués. Tu écris ce que tu veux, l&apos;IA
                    s&apos;occupe du reste — fond, lumière, style, ambiance.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {PROMPT_SUGGESTIONS.map((p) => (
                      <span
                        key={p}
                        className="rounded-full bg-surface px-3 py-1.5 text-sm text-ink-muted ring-1 ring-hairline"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading
                eyebrow="Comment ça marche"
                title="Trois étapes, c'est tout"
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <div className="h-full rounded-3xl bg-surface p-6 ring-1 ring-hairline">
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-spectrum-soft text-scan ring-1 ring-hairline">
                        <step.icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-sm text-ink-faint">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Preuve sociale */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-scan">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Rejoins{" "}
                  <span className="text-gradient">+12 000 créateurs</span>
                </h2>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <figure className="h-full rounded-3xl bg-surface p-6 ring-1 ring-hairline">
                    <blockquote className="text-ink">“{t.quote}”</blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-spectrum text-sm font-bold text-white">
                        {t.name[0]}
                      </span>
                      <span className="text-sm text-ink-muted">
                        {t.name} · {t.meta}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-5 py-24 sm:px-8">
          <Reveal>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-surface px-6 py-14 text-center ring-1 ring-hairline sm:px-12">
              <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-64 bg-radial-brand" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-success ring-1 ring-success/30">
                  <Sparkles className="h-4 w-4" /> 7 jours gratuits
                </span>
                <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                  Prêt à transformer
                  <br />
                  ta première photo ?
                </h2>
                <p className="mx-auto mt-4 max-w-md text-ink-muted">
                  Commence gratuitement aujourd&apos;hui. On te prévient avant la
                  fin de l&apos;essai — aucune mauvaise surprise.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/auth/signup"
                    className={cn(buttonVariants({ size: "lg" }), "group")}
                  >
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <p className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-faint">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Paiement sécurisé Stripe · annulable en 1 clic
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-bright">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 leading-relaxed text-ink-muted">{subtitle}</p>
      )}
    </div>
  );
}
