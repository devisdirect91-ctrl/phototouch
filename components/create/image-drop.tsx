"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 10;

export function ImageDrop({
  label,
  hint,
  value,
  onChange,
  onError,
  compact = false,
}: {
  label: string;
  hint?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onError?: (message: string) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function accept(file?: File | null) {
    if (!file) return;
    if (!ACCEPT.includes(file.type)) {
      onError?.("Format non supporté — utilise JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      onError?.(`Image trop lourde (max ${MAX_MB} Mo).`);
      return;
    }
    onChange(file);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "relative grid w-full cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright/70",
        dragging
          ? "border-brand-bright bg-brand/10"
          : "border-white/15 bg-surface hover:bg-surface-raised",
        preview ? "p-0" : compact ? "p-6" : "p-8",
      )}
    >
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Aperçu"
            className={cn(
              "w-full rounded-2xl object-contain",
              compact ? "max-h-44" : "max-h-72",
            )}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            aria-label="Retirer l'image"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-ink ring-1 ring-white/10 backdrop-blur transition hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-spectrum-soft text-scan ring-1 ring-hairline">
            <ImagePlus className="h-5 w-5" />
          </span>
          <p className="mt-3 font-medium">{label}</p>
          {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
          <p className="mt-1 text-xs text-ink-faint">
            JPG, PNG ou WebP · max {MAX_MB} Mo
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(",")}
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0])}
      />
    </div>
  );
}
