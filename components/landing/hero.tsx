"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] ring-1 ring-hairline shadow-glow-soft">
      <div
        className="absolute inset-0 bg-canvas"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 30% 18%, rgba(124,58,237,0.6), transparent 60%), radial-gradient(120% 90% at 82% 95%, rgba(34,211,238,0.45), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-32 w-32 animate-float rounded-full bg-gradient-to-br from-brand-bright/80 to-scan/70 shadow-glow-brand" />
      </div>
      <div className="absolute inset-0 bg-grid-fade opacity-60" />

      {/* faisceau de scan */}
      <div className="absolute inset-0 animate-scan-y">
        <div className="h-24 w-full bg-gradient-to-b from-transparent via-scan/25 to-transparent" />
        <div className="h-px w-full bg-scan shadow-glow-scan" />
      </div>

      {/* réticules */}
      <span className="absolute left-3 top-3 h-5 w-5 border-l border-t border-scan/70" />
      <span className="absolute right-3 top-3 h-5 w-5 border-r border-t border-scan/70" />
      <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-scan/70" />
      <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-scan/70" />

      {/* readouts */}
      <div className="absolute left-9 top-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-scan">
        ● Analyse IA
      </div>
      <span className="absolute right-8 top-3 rounded-full bg-success/20 px-2.5 py-1 text-[11px] font-semibold text-success ring-1 ring-success/30">
        Après
      </span>
      <span className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 font-mono text-[11px] text-ink/90 ring-1 ring-hairline backdrop-blur">
        « style cinématique »
      </span>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
      {/* lueur d'ambiance */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-radial-brand" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-success ring-1 ring-success/30">
              <Sparkles className="h-4 w-4" /> Gratuit pendant 7 jours
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Tes photos,
            <br />
            <span className="text-gradient">transformées</span> par l&apos;IA.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-ink-muted"
          >
            Importe une photo, écris ce que tu veux changer, et l&apos;IA génère
            le résultat en quelques secondes. Aucune compétence requise.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/auth/signup"
              className={cn(buttonVariants({ size: "lg" }), "group")}
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#showcase"
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              Voir des exemples
            </Link>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-5 flex items-center gap-2 text-sm text-ink-faint"
          >
            <ShieldCheck className="h-4 w-4 text-success" />
            Sans engagement · annulable en 1 clic · images modérées
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
