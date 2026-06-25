import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AppHeader } from "@/components/app/app-header";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Résultat" };

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signup");

  const id = searchParams.id;
  if (!id) redirect("/create");

  const { data: gen } = await supabase
    .from("generations")
    .select("*")
    .eq("id", id)
    .single();
  if (!gen) redirect("/create");

  let url: string | null = null;
  if (gen.result_image_url) {
    const admin = createAdminClient();
    const { data: signed } = await admin.storage
      .from("results")
      .createSignedUrl(gen.result_image_url, 3600);
    url = signed?.signedUrl ?? null;
  }

  return (
    <div>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Ton résultat
        </h1>
        {gen.prompt && (
          <p className="mt-1 text-sm text-ink-muted">« {gen.prompt} »</p>
        )}

        <div className="mt-6 overflow-hidden rounded-3xl ring-1 ring-hairline">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Image générée" className="w-full" />
          ) : (
            <div className="grid aspect-square place-items-center bg-surface px-6 text-center text-ink-muted">
              {gen.status === "blocked"
                ? "Contenu refusé par la modération."
                : gen.status === "failed"
                  ? "La génération a échoué."
                  : "Génération en cours…"}
            </div>
          )}
        </div>

        <p className="mt-4 font-mono text-xs text-ink-faint">
          statut : {gen.status} · modèle : {gen.model_used ?? "—"}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/create" className={buttonVariants({ variant: "secondary" })}>
            Nouvelle transformation
          </Link>
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          Aperçu minimal — le paywall (résultat flouté pour les non-abonnés)
          arrive à l&apos;étape 9.
        </p>
      </main>
    </div>
  );
}
