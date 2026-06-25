import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  moderateText,
  moderateImage,
  logModeration,
  MODERATION_BLOCK_MESSAGE,
} from "@/lib/moderation";
import { generateImage } from "@/lib/generate";
import { TRIAL_GENERATION_LIMIT } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 60;

const PREMIUM_STATUSES = ["trialing", "active", "lifetime"];

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

  // Limite d'essai
  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status, generations_used_trial")
    .eq("id", user.id)
    .single();
  const isPremium = PREMIUM_STATUSES.includes(
    profile?.subscription_status ?? "free",
  );
  const used = profile?.generations_used_trial ?? 0;
  if (!isPremium && used >= TRIAL_GENERATION_LIMIT) {
    return NextResponse.json(
      { error: "Tu as utilisé toutes tes générations d'essai." },
      { status: 403 },
    );
  }

  // Ligne de génération (processing)
  const { data: gen, error: genErr } = await admin
    .from("generations")
    .insert({ user_id: user.id, prompt, status: "processing" })
    .select("id")
    .single();
  if (genErr || !gen) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
  const generationId = gen.id;

  try {
    // 1. Modération du prompt + de l'image source
    const sourceBuffer = Buffer.from(await source.arrayBuffer());
    const [promptVerdict, sourceVerdict] = await Promise.all([
      moderateText(prompt),
      moderateImage(dataUri(sourceBuffer, source.type || "image/png")),
    ]);
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

    // 2. Upload des sources
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

    // 3. Génération
    const { buffer, model } = await generateImage({
      source,
      reference,
      prompt,
    });

    // 4. Modération du résultat
    const resultVerdict = await moderateImage(dataUri(buffer));
    await logModeration({
      userId: user.id,
      type: "result_image",
      passed: !resultVerdict.flagged,
      reason: resultVerdict.reason,
      generationId,
    });
    if (resultVerdict.flagged) {
      await admin
        .from("generations")
        .update({ status: "blocked", moderation_passed: false, model_used: model })
        .eq("id", generationId);
      return NextResponse.json(
        { error: MODERATION_BLOCK_MESSAGE, blocked: true },
        { status: 422 },
      );
    }

    // 5. Stockage du résultat
    const resultPath = `${user.id}/${generationId}.png`;
    await admin.storage.from("results").upload(resultPath, buffer, {
      contentType: "image/png",
      upsert: true,
    });

    // 6. Finalisation + incrément du compteur d'essai
    await admin
      .from("generations")
      .update({
        status: "completed",
        moderation_passed: true,
        model_used: model,
        source_image_url: sourcePath,
        reference_image_url: referencePath,
        result_image_url: resultPath,
      })
      .eq("id", generationId);

    if (!isPremium) {
      await admin
        .from("profiles")
        .update({ generations_used_trial: used + 1 })
        .eq("id", user.id);
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
