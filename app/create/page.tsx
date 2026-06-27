import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/app-header";
import { CreateStudio } from "@/components/create/create-studio";
import { BottomNav } from "@/components/app/bottom-nav";
import { TRIAL_GENERATION_LIMIT } from "@/lib/constants";

export const metadata: Metadata = { title: "Créer" };

const PREMIUM_STATUSES = ["trialing", "active", "lifetime"];

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

  const isPremium = PREMIUM_STATUSES.includes(
    profile?.subscription_status ?? "free",
  );
  const remaining = Math.max(
    0,
    TRIAL_GENERATION_LIMIT - (profile?.generations_used_trial ?? 0),
  );

  return (
    <div className="pb-24">
      <AppHeader />
      <main>
        <CreateStudio remaining={remaining} isPremium={isPremium} />
      </main>
      <BottomNav />
    </div>
  );
}
