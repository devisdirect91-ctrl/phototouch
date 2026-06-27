import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { generateImage } from "@/lib/generate";
import {
  moderateImage,
  logModeration,
  MODERATION_BLOCK_MESSAGE,
} from "@/lib/moderation";

type Admin = SupabaseClient<Database>;

function dataUri(buffer: Buffer) {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export type RealGenerationResult =
  | { ok: true }
  | { ok: false; blocked: boolean; error: string };

/**
 * Lance la vraie génération IA : gpt-image-1 → modération du résultat → stockage
 * → mise à jour de la ligne `generations`. Utilisé par /api/generate (payant)
 * et /api/generate/fulfill (après paiement d'un bluff).
 */
export async function runRealGeneration(
  admin: Admin,
  params: {
    userId: string;
    generationId: string;
    source: Blob;
    reference: Blob | null;
    prompt: string;
  },
): Promise<RealGenerationResult> {
  const { userId, generationId, source, reference, prompt } = params;

  const { buffer, model } = await generateImage({ source, reference, prompt });

  const verdict = await moderateImage(dataUri(buffer));
  await logModeration({
    userId,
    type: "result_image",
    passed: !verdict.flagged,
    reason: verdict.reason,
    generationId,
  });
  if (verdict.flagged) {
    await admin
      .from("generations")
      .update({ status: "blocked", moderation_passed: false, model_used: model })
      .eq("id", generationId);
    return { ok: false, blocked: true, error: MODERATION_BLOCK_MESSAGE };
  }

  const resultPath = `${userId}/${generationId}.png`;
  await admin.storage
    .from("results")
    .upload(resultPath, buffer, { contentType: "image/png", upsert: true });

  await admin
    .from("generations")
    .update({
      status: "completed",
      moderation_passed: true,
      model_used: model,
      result_image_url: resultPath,
    })
    .eq("id", generationId);

  return { ok: true };
}
