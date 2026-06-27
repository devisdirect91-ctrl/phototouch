import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  moderateText,
  moderateImage,
  logModeration,
  MODERATION_BLOCK_MESSAGE,
} from "@/lib/moderation";
import { runRealGeneration } from "@/lib/generation-pipeline";
import { generationPolicy } from "@/lib/subscription";

export const runtime = "nodejs";
export const maxDuration = 120;

function dataUri(buffer: Buffer, type = "image/png") {
  return `data:${type};base64,${buffer.toString("base64")}`;
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const form = await request.formData();
  const source = form.get("source");
  const referenceRaw = form.get("reference");
  const prompt = String(form.get("prompt") ?? "").trim();
  if (!(source instanceof Blob) || !prompt) {
    return NextResponse.json(
      { error: "Photo et description requises." },
      { status: 400 },
    );
  }
  const reference = referenceRaw instanceof Blob ? referenceRaw : null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status, generations_used_trial")
    .eq("id", user.id)
    .single();
  const status = profile?.subscription_status ?? "free";
  const used = profile?.generations_used_trial ?? 0;
  const policy = generationPolicy(status);

  if (used >= policy.cap) {
    return NextResponse.json(
      {
        error: policy.real
          ? "Tu as atteint ta limite de générations pour le moment."
          : "Tu as déjà utilisé ton aperçu gratuit.",
        limit: true,
        real: policy.real,
      },
      { status: 403 },
    );
  }

  // Modération prompt + image source (gratuit, toujours)
  const sourceBuffer = Buffer.from(await source.arrayBuffer());
  const [promptVerdict, sourceVerdict] = await Promise.all([
    moderateText(prompt),
    moderateImage(dataUri(sourceBuffer, source.type || "image/png")),
  ]);

  const { data: gen, error: genErr } = await admin
    .from("generations")
    .insert({ user_id: user.id, prompt, status: "processing" })
    .select("id")
    .single();
  if (genErr || !gen) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
  const generationId = gen.id;

  await Promise.all([
    logModeration({
      userId: user.id,
      type: "prompt",
      passed: !promptVerdict.flagged,
      reason: promptVerdict.reason,
      generationId,
    }),
    logModeration({
      userId: user.id,
      type: "source_image",
      passed: !sourceVerdict.flagged,
      reason: sourceVerdict.reason,
      generationId,
    }),
  ]);
  if (promptVerdict.flagged || sourceVerdict.flagged) {
    await admin
      .from("generations")
      .update({ status: "blocked", moderation_passed: false })
      .eq("id", generationId);
    return NextResponse.json(
      { error: MODERATION_BLOCK_MESSAGE, blocked: true },
      { status: 422 },
    );
  }

  // Upload de la source (+ référence) — nécessaire pour le flou + la génération
  // réelle après paiement.
  const sourcePath = `${user.id}/${generationId}.png`;
  await admin.storage.from("user-uploads").upload(sourcePath, source, {
    contentType: source.type || "image/png",
    upsert: true,
  });
  let referencePath: string | null = null;
  if (reference) {
    referencePath = `${user.id}/${generationId}.png`;
    await admin.storage.from("references").upload(referencePath, reference, {
      contentType: reference.type || "image/png",
      upsert: true,
    });
  }
  await admin
    .from("generations")
    .update({ source_image_url: sourcePath, reference_image_url: referencePath })
    .eq("id", generationId);

  // Incrémente le compteur (le bluff comme la génération réelle comptent).
  await admin
    .from("profiles")
    .update({ generations_used_trial: used + 1 })
    .eq("id", user.id);

  // BLUFF (utilisateur gratuit) : pas d'appel IA. On marque "completed" sans résultat.
  if (!policy.real) {
    await admin
      .from("generations")
      .update({ status: "completed" })
      .eq("id", generationId);
    return NextResponse.json({ id: generationId });
  }

  // RÉEL (payant) : génération immédiate.
  try {
    const result = await runRealGeneration(admin, {
      userId: user.id,
      generationId,
      source,
      reference,
      prompt,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, blocked: result.blocked },
        { status: result.blocked ? 422 : 500 },
      );
    }
    return NextResponse.json({ id: generationId });
  } catch (err) {
    console.error("[generate]", err);
    await admin
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generationId);
    return NextResponse.json(
      { error: "La génération a échoué. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
