import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runRealGeneration } from "@/lib/generation-pipeline";
import { generationPolicy } from "@/lib/subscription";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Lance la VRAIE génération d'un « bluff » créé pendant la période gratuite,
 * une fois que l'utilisateur a payé (statut payant).
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: gen } = await admin
    .from("generations")
    .select("*")
    .eq("id", id)
    .single();
  if (!gen || gen.user_id !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }
  // Déjà généré → rien à faire.
  if (gen.result_image_url) {
    return NextResponse.json({ id });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  if (!generationPolicy(profile?.subscription_status ?? "free").real) {
    return NextResponse.json({ error: "Abonnement requis." }, { status: 403 });
  }
  if (!gen.source_image_url) {
    return NextResponse.json({ error: "Source introuvable." }, { status: 400 });
  }

  const { data: srcBlob } = await admin.storage
    .from("user-uploads")
    .download(gen.source_image_url);
  if (!srcBlob) {
    return NextResponse.json({ error: "Source introuvable." }, { status: 400 });
  }
  let refBlob: Blob | null = null;
  if (gen.reference_image_url) {
    const { data } = await admin.storage
      .from("references")
      .download(gen.reference_image_url);
    refBlob = data ?? null;
  }

  await admin
    .from("generations")
    .update({ status: "processing" })
    .eq("id", id);

  try {
    const result = await runRealGeneration(admin, {
      userId: user.id,
      generationId: id,
      source: srcBlob,
      reference: refBlob,
      prompt: gen.prompt ?? "",
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, blocked: result.blocked },
        { status: result.blocked ? 422 : 500 },
      );
    }
    return NextResponse.json({ id });
  } catch (err) {
    console.error("[fulfill]", err);
    await admin
      .from("generations")
      .update({ status: "failed" })
      .eq("id", id);
    return NextResponse.json(
      { error: "La génération a échoué. Réessaie." },
      { status: 500 },
    );
  }
}
