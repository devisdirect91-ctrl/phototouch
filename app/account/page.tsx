import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";
import { AccountActions } from "@/components/account/account-actions";
import { hasActiveSubscription } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Profil" };

const STATUS_LABEL: Record<string, string> = {
  free: "Gratuit",
  trialing: "Essai gratuit en cours",
  active: "Abonné",
  past_due: "Paiement en retard",
  canceled: "Annulé",
  lifetime: "Accès à vie",
};

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, trial_ends_at, stripe_customer_id, is_admin")
    .eq("id", user.id)
    .single();

  const status = profile?.subscription_status ?? "free";
  const isPremium = hasActiveSubscription(status);

  return (
    <div className="pb-24">
      <AppHeader />
      <main className="mx-auto max-w-md px-5 py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Profil</h1>

        <div className="mt-6 rounded-3xl bg-surface p-5 ring-1 ring-hairline">
          <p className="text-xs uppercase tracking-wider text-ink-faint">Email</p>
          <p className="mt-1 break-all text-ink">{user.email}</p>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-faint">
                Abonnement
              </p>
              <p className="mt-1 text-ink">{STATUS_LABEL[status] ?? status}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                isPremium
                  ? "bg-success/15 text-success ring-success/30"
                  : "bg-surface-raised text-ink-muted ring-hairline",
              )}
            >
              {isPremium ? "Premium" : "Gratuit"}
            </span>
          </div>

          {status === "trialing" && profile?.trial_ends_at && (
            <p className="mt-3 text-xs text-ink-faint">
              Essai gratuit jusqu&apos;au{" "}
              {new Date(profile.trial_ends_at).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>

        {profile?.is_admin && (
          <Link
            href="/admin"
            className={cn(buttonVariants({ variant: "secondary" }), "mt-6 w-full")}
          >
            Tableau de bord admin
          </Link>
        )}

        <div className="mt-6">
          <AccountActions hasCustomer={!!profile?.stripe_customer_id} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
