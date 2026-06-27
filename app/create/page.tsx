import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";
import { CreateStudio } from "@/components/create/create-studio";
import { buttonVariants } from "@/components/ui/button";
import { generationPolicy } from "@/lib/subscription";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Créer" };

export default async function CreatePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signup");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, generations_used_trial")
    .eq("id", user.id)
    .single();
  const status = profile?.subscription_status ?? "free";
  const used = profile?.generations_used_trial ?? 0;
  const policy = generationPolicy(status);

  // Utilisateur gratuit ayant déjà utilisé son aperçu → on pousse vers l'offre.
  if (!policy.real && used >= policy.cap) {
    const { data: last } = await supabase
      .from("generations")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return (
      <div className="pb-24">
        <AppHeader />
        <main className="mx-auto flex max-w-md flex-col px-5 py-16 text-center">
          <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-success ring-1 ring-success/30">
            <Sparkles className="h-4 w-4" /> 7 jours gratuits
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">
            Débloque tes transformations
          </h1>
          <p className="mt-2 text-ink-muted">
            Lance ton essai gratuit pour générer pour de vrai, en illimité.
          </p>
          <Link
            href={last ? `/result?id=${last.id}` : "/account"}
            className={cn(buttonVariants({ size: "lg" }), "mt-7")}
          >
            Commencer gratuitement
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <AppHeader />
      <main>
        <CreateStudio isPremium={policy.real} />
      </main>
      <BottomNav />
    </div>
  );
}
