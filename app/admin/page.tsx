import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin" };

const PRICE_MONTHLY = 7.99;

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) redirect("/create");

  const admin = createAdminClient();
  const day = 86_400_000;
  const since7 = new Date(Date.now() - 7 * day).toISOString();
  const since30 = new Date(Date.now() - 30 * day).toISOString();
  const c = (q: PromiseLike<{ count: number | null }>) =>
    Promise.resolve(q).then((r) => r.count ?? 0);

  const p = () =>
    admin.from("profiles").select("*", { count: "exact", head: true });
  const g = () =>
    admin.from("generations").select("*", { count: "exact", head: true });

  const [
    usersTotal,
    users7,
    users30,
    free,
    trial,
    paid,
    gensTotal,
    gensReal,
    gensBluff,
    gensBlocked,
    gensFailed,
  ] = await Promise.all([
    c(p()),
    c(p().gte("created_at", since7)),
    c(p().gte("created_at", since30)),
    c(p().eq("subscription_status", "free")),
    c(p().eq("subscription_status", "trialing")),
    c(p().in("subscription_status", ["active", "lifetime"])),
    c(g()),
    c(g().eq("status", "completed").not("result_image_url", "is", null)),
    c(g().eq("status", "completed").is("result_image_url", null)),
    c(g().eq("status", "blocked")),
    c(g().eq("status", "failed")),
  ]);

  const conversion =
    usersTotal > 0 ? (((trial + paid) / usersTotal) * 100).toFixed(1) : "0";
  const mrr = (paid * PRICE_MONTHLY).toFixed(0);

  const sections: { title: string; stats: { label: string; value: string; hint?: string }[] }[] =
    [
      {
        title: "Utilisateurs",
        stats: [
          { label: "Total", value: String(usersTotal) },
          { label: "Nouveaux (7 j)", value: `+${users7}` },
          { label: "Nouveaux (30 j)", value: `+${users30}` },
        ],
      },
      {
        title: "Abonnements",
        stats: [
          { label: "Gratuit", value: String(free) },
          { label: "Essai en cours", value: String(trial) },
          { label: "Payant", value: String(paid) },
          { label: "Conversion", value: `${conversion}%`, hint: "essai+payant / total" },
          { label: "Revenu mensuel", value: `≈ ${mrr} €`, hint: "estimation" },
        ],
      },
      {
        title: "Générations",
        stats: [
          { label: "Total", value: String(gensTotal) },
          { label: "Réelles (payées)", value: String(gensReal) },
          { label: "Bluffs (gratuit)", value: String(gensBluff) },
          { label: "Bloquées (modération)", value: String(gensBlocked) },
          { label: "Échouées", value: String(gensFailed) },
        ],
      },
    ];

  return (
    <div className="pb-24">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-ink-muted">Les chiffres de PhotoTouch.</p>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink-muted">
                {section.title}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {section.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-surface p-4 ring-1 ring-hairline"
                  >
                    <p className="font-display text-2xl font-bold tracking-tight">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">{s.label}</p>
                    {s.hint && (
                      <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                        {s.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink-muted">
              Trafic & visites
            </h2>
            <p className="mt-3 rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink-muted ring-1 ring-hairline">
              Les visites ne sont pas stockées en base. Active{" "}
              <Link
                href="https://vercel.com/docs/analytics"
                className="text-scan hover:opacity-80"
              >
                Vercel Analytics
              </Link>{" "}
              (gratuit, déjà sur ton hébergement) pour le trafic, les sources et
              les pages vues — dis-moi si tu veux que je le branche.
            </p>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
