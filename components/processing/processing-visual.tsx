"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

const PARTICLES = [
  { left: "12%", delay: 0, dur: 3.4 },
  { left: "26%", delay: 0.8, dur: 4.1 },
  { left: "40%", delay: 1.6, dur: 3.0 },
  { left: "54%", delay: 0.4, dur: 4.6 },
  { left: "68%", delay: 1.2, dur: 3.7 },
  { left: "82%", delay: 2.0, dur: 4.0 },
  { left: "20%", delay: 2.4, dur: 3.2 },
  { left: "74%", delay: 0.6, dur: 4.3 },
];

export function ProcessingVisual({
  imageUrl,
  progress,
  status,
  error,
  onRetry,
}: {
  imageUrl?: string | null;
  progress: number;
  status: string;
  error?: string | null;
  onRetry?: () => void;
}) {
  const reduce = useReducedMotion();

  if (error) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-canvas px-6">
        <div className="w-full max-w-sm rounded-3xl bg-surface p-8 text-center ring-1 ring-hairline">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger/15 text-danger ring-1 ring-danger/30">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold tracking-tight">
            Oups…
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{error}</p>
          <div className="mt-6 flex flex-col gap-3">
            {onRetry && (
              <Button type="button" onClick={onRetry}>
                <RotateCcw className="h-4 w-4" /> Réessayer
              </Button>
            )}
            <Link
              href="/create"
              className={buttonVariants({ variant: "ghost" })}
            >
              Retour au studio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-radial-brand" />

      <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[2rem] ring-1 ring-hairline shadow-glow-soft">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(120% 90% at 30% 20%, rgba(124,58,237,0.6), transparent 60%), radial-gradient(120% 90% at 82% 95%, rgba(34,211,238,0.45), transparent 55%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-canvas/40" />
        <div className="absolute inset-0 bg-grid-fade" />

        {/* faisceau de scan */}
        <div className="absolute inset-0 animate-scan-y">
          <div className="h-24 w-full bg-gradient-to-b from-transparent via-scan/30 to-transparent" />
          <div className="h-0.5 w-full bg-scan shadow-glow-scan" />
        </div>

        {/* particules */}
        {!reduce &&
          PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 h-1 w-1 rounded-full bg-scan"
              style={{ left: p.left }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: "-260px", opacity: [0, 0.9, 0] }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

        {/* réticules */}
        <span className="absolute left-3 top-3 h-5 w-5 border-l border-t border-scan/70" />
        <span className="absolute right-3 top-3 h-5 w-5 border-r border-t border-scan/70" />
        <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-scan/70" />
        <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-scan/70" />

        <div className="absolute left-4 top-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-scan">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-scan" />{" "}
          Analyse IA
        </div>
      </div>

      <div className="mt-8 w-full max-w-[280px] text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Transformation en cours
        </h1>
        <p className="mt-2 min-h-[1.25rem] text-sm text-ink-muted">{status}</p>

        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
          <motion.div
            className="h-full rounded-full bg-spectrum"
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-ink-faint">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
