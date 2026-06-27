"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wand2, Images, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/create", label: "Créer", icon: Wand2 },
  { href: "/gallery", label: "Galerie", icon: Images },
  { href: "/account", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-4 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition",
                active ? "text-ink" : "text-ink-faint hover:text-ink-muted",
              )}
            >
              <t.icon className={cn("h-5 w-5", active && "text-scan")} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
