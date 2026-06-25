"use client";

import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

function Scene({ muted = false }: { muted?: boolean }) {
  return (
    <div className="absolute inset-0 bg-canvas">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: muted
            ? "radial-gradient(120% 90% at 35% 25%, rgba(120,120,140,0.45), transparent 60%), radial-gradient(120% 90% at 80% 95%, rgba(90,90,110,0.4), transparent 55%)"
            : "radial-gradient(120% 90% at 35% 25%, rgba(124,58,237,0.7), transparent 60%), radial-gradient(120% 90% at 80% 95%, rgba(34,211,238,0.55), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div
          className={cn(
            "h-28 w-28 rounded-full transition-none",
            muted
              ? "bg-white/10 ring-1 ring-white/10"
              : "bg-gradient-to-br from-brand-bright/80 to-scan/70 shadow-glow-brand",
          )}
        />
      </div>
    </div>
  );
}

/** Slider avant/après draggable (pointer + clavier). */
export function BeforeAfter({ className }: { className?: string }) {
  const [pos, setPos] = useState(58);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-3xl ring-1 ring-hairline shadow-glow-soft",
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* Après (base) */}
      <Scene />
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-success/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-success ring-1 ring-success/30">
        Après
      </span>

      {/* Avant (calque rogné à gauche) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Scene muted />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted ring-1 ring-hairline backdrop-blur">
          Avant
        </span>
      </div>

      {/* Poignée */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-scan/80 shadow-glow-scan"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label="Comparer avant / après"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
          }}
          className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-canvas/90 text-scan ring-1 ring-scan/50 backdrop-blur transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scan"
        >
          <MoveHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
