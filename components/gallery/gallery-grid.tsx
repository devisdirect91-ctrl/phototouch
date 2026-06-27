"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Item = { id: string; prompt: string | null; url: string | null };

export function GalleryGrid({ items: initial }: { items: Item[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(id: string) {
    if (!window.confirm("Supprimer cette création ?")) return;
    setBusy(id);
    const supabase = createClient();
    await supabase.from("generations").delete().eq("id", id);
    setItems((xs) => xs.filter((x) => x.id !== id));
    setBusy(null);
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-3xl bg-surface p-10 text-center ring-1 ring-hairline">
        <p className="text-ink-muted">Aucune création pour l&apos;instant.</p>
        <Link href="/create" className="mt-4 inline-block text-sm text-scan hover:opacity-80">
          Crée ta première transformation →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.id}
          className="group relative aspect-square overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline"
        >
          {it.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={it.url}
              alt={it.prompt ?? "Création"}
              className="h-full w-full object-cover"
            />
          ) : (
            <Link
              href={`/result?id=${it.id}`}
              className="grid h-full w-full place-items-center bg-spectrum-soft"
            >
              <Lock className="h-6 w-6 text-ink-muted" />
            </Link>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => remove(it.id)}
              disabled={busy === it.id}
              aria-label="Supprimer"
              className="pointer-events-auto grid h-7 w-7 place-items-center rounded-full bg-black/60 text-danger ring-1 ring-white/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
