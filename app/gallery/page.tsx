import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { hasActiveSubscription } from "@/lib/subscription";

export const metadata: Metadata = { title: "Galerie" };

export default async function GalleryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  const isPremium = hasActiveSubscription(profile?.subscription_status);

  const { data: generations } = await supabase
    .from("generations")
    .select("id, prompt, result_image_url")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .not("result_image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(60);

  const admin = createAdminClient();
  const items = await Promise.all(
    (generations ?? []).map(async (g) => {
      let url: string | null = null;
      if (isPremium && g.result_image_url) {
        const { data } = await admin.storage
          .from("results")
          .createSignedUrl(g.result_image_url, 3600);
        url = data?.signedUrl ?? null;
      }
      return { id: g.id, prompt: g.prompt, url };
    }),
  );

  return (
    <div className="pb-24">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Ta galerie
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {isPremium
            ? "Toutes tes créations, au même endroit."
            : "Débloque tes créations avec l'essai gratuit."}
        </p>
        <GalleryGrid items={items} />
      </main>
      <BottomNav />
    </div>
  );
}
