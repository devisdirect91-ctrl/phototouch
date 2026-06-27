"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getPendingGeneration,
  clearPendingGeneration,
} from "@/lib/generation-store";
import { ProcessingVisual } from "@/components/processing/processing-visual";

const STATUSES = [
  "Analyse de l'image…",
  "Compréhension de ta demande…",
  "Application des modifications…",
  "Génération en cours…",
  "Vérification du résultat…",
  "Finalisation…",
  "Derniers détails…",
  "Presque prêt ✨",
];
const MIN_MS = 3500;

export default function ProcessingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(8);
  const [statusIdx, setStatusIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  function run() {
    const pending = getPendingGeneration();
    if (!pending) {
      router.replace("/create");
      return;
    }
    setError(null);
    setStatusIdx(0);
    setProgress(8);
    const start = Date.now();

    (async () => {
      try {
        const fd = new FormData();
        fd.append("source", pending.source);
        if (pending.reference) fd.append("reference", pending.reference);
        fd.append("prompt", pending.prompt);

        const res = await fetch("/api/generate", { method: "POST", body: fd });
        const data = (await res.json().catch(() => ({}))) as {
          id?: string;
          error?: string;
        };

        const elapsed = Date.now() - start;
        if (elapsed < MIN_MS) {
          await new Promise((r) => setTimeout(r, MIN_MS - elapsed));
        }

        if (!res.ok || !data.id) {
          setError(data.error ?? "La génération a échoué. Réessaie.");
          return;
        }
        setProgress(100);
        clearPendingGeneration();
        router.replace(`/result?id=${data.id}`);
      } catch {
        setError("Erreur réseau. Vérifie ta connexion et réessaie.");
      }
    })();
  }

  useEffect(() => {
    const pending = getPendingGeneration();
    if (pending) {
      const url = URL.createObjectURL(pending.source);
      urlRef.current = url;
      setImageUrl(url);
    }
    if (!startedRef.current) {
      startedRef.current = true;
      run();
    }
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
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
      imageUrl={imageUrl}
      progress={progress}
      status={STATUSES[statusIdx]}
      error={error}
      onRetry={run}
    />
  );
}
