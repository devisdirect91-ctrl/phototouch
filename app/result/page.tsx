import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AppHeader } from "@/components/app/app-header";
import { Paywall } from "@/components/result/paywall";
import { DownloadButton } from "@/components/result/download-button";
import { FulfillResult } from "@/components/result/fulfill-result";
import { buttonVariants } from "@/components/ui/button";
import { hasActiveSubscription } from "@/lib/subscription";
import { cn } from "@/lib/utils";

export const runtime = "nodejs";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  const isPaid = hasActiveSubscription(profile?.subscription_status);
  const admin = createAdminClient();

  // Bloqué / échoué
  if (gen.status === "blocked" || gen.status === "failed") {
    const message =
      gen.status === "blocked"
        ? "Ce contenu a été refusé par la modération."
        : "La génération a échoué.";
    return (
      <div>
        <AppHeader />
        <main className="mx-auto max-w-md px-5 py-16 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {message}
          </h1>
          <Link
            href="/create"
            className={cn(buttonVariants(), "mt-6 inline-flex")}
          >
            Nouvelle transformation
          </Link>
        </main>
      </div>
    );
  }

  // Payant
  if (isPaid) {
    // Bluff payé mais pas encore généré → on lance la vraie génération
    if (!gen.result_image_url) {
      return <FulfillResult id={gen.id} />;
    }

    const { data: signed } = await admin.storage
      .from("results")
      .createSignedUrl(gen.result_image_url, 3600);
    const url = signed?.signedUrl ?? null;

    return (
      <div>
        <AppHeader />
        <main className="mx-auto max-w-md px-5 py-8">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Ton résultat
          </h1>
          {gen.prompt && (
            <p className="mt-1 text-sm text-ink-muted">« {gen.prompt} »</p>
          )}
          <div className="mt-6 overflow-hidden rounded-3xl ring-1 ring-hairline">
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="Image générée" className="w-full" />
            )}
          </div>
          <div className="mt-6 space-y-3">
            {url && <DownloadButton url={url} />}
            <Link
              href="/create"
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              Nouvelle transformation
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Gratuit (bluff) → aperçu flouté (source stylisée) + paywall
  let previewSrc = "";
  if (gen.source_image_url) {
    const { data: blob } = await admin.storage
      .from("user-uploads")
      .download(gen.source_image_url);
    if (blob) {
      const buffer = Buffer.from(await blob.arrayBuffer());
      const preview = await sharp(buffer)
        .resize(420)
        .modulate({ saturation: 1.35, brightness: 1.05 })
        .blur(16)
        .jpeg({ quality: 45 })
        .toBuffer();
      previewSrc = `data:image/jpeg;base64,${preview.toString("base64")}`;
    }
  }

  return (
    <div>
      <AppHeader />
      <Paywall previewSrc={previewSrc} generationId={gen.id} />
    </div>
  );
}
