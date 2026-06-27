"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Compte une visite par page vue (hors /admin). */
export function ViewTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    if (pathname.startsWith("/admin")) return; // ne pas compter l'admin

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
