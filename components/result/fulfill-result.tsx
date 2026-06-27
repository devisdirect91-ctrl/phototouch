"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProcessingVisual } from "@/components/processing/processing-visual";

const STATUSES = [
  "Préparation de ton image…",
  "Application des modifications…",
  "Génération en cours…",
  "Finalisation…",
  "Derniers détails…",
  "Presque prêt ✨",
];

export function FulfillResult({ id }: { id: string }) {
  const router = useRouter();
  const [progress, setProgress] = useState(10);
  const [statusIdx, setStatusIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  function run() {
    setError(null);
    setProgress(10);
    setStatusIdx(0);
    (async () => {
      try {
        const res = await fetch("/api/generate/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          id?: string;
          error?: string;
        };
        if (!res.ok) {
          setError(data.error ?? "La génération a échoué. Réessaie.");
          return;
        }
        setProgress(100);
        router.refresh();
      } catch {
        setError("Erreur réseau. Réessaie.");
      }
    })();
  }

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) return;
    const t = setInterval(() => {
      setProgress((p) =>
        p >= 99 ? p : Math.min(99, p + Math.max(0.15, (99 - p) * 0.04)),
      );
    }, 250);
    return () => clearInterval(t);
  }, [error]);

  useEffect(() => {
    if (error) return;
    const t = setInterval(() => {
      setStatusIdx((i) => Math.min(i + 1, STATUSES.length - 1));
    }, 2200);
    return () => clearInterval(t);
  }, [error]);

  return (
    <ProcessingVisual
      progress={progress}
      status={STATUSES[statusIdx]}
      error={error}
      onRetry={run}
    />
  );
}
