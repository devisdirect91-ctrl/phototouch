"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/site/logo";

export function AppHeader() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
        <Link href="/create" aria-label="Créer">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-muted transition hover:bg-white/5 hover:text-ink"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
    </header>
  );
}
