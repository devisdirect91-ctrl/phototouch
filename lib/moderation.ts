import { getOpenAI } from "@/lib/openai";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ModerationType } from "@/lib/database.types";

export type ModerationVerdict = {
  /** true = contenu refusé. */
  flagged: boolean;
  /** catégories OpenAI déclenchées (pour les logs), ou null. */
  reason: string | null;
};

type ModerationResultLike = {
  flagged: boolean;
  categories: object;
};

function toVerdict(result: ModerationResultLike): ModerationVerdict {
  if (!result.flagged) return { flagged: false, reason: null };
  const flaggedCategories = Object.entries(result.categories)
    .filter(([, value]) => value)
    .map(([key]) => key);
  return {
    flagged: true,
    reason: flaggedCategories.join(", ") || "inappropriate",
  };
}

/** Modère un texte (prompt) via OpenAI omni-moderation. Fail-open sur erreur API. */
export async function moderateText(text: string): Promise<ModerationVerdict> {
  try {
    const openai = getOpenAI();
    const res = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });
    return toVerdict(res.results[0]);
  } catch (err) {
    console.error("[moderation] texte — erreur API:", err);
    return { flagged: false, reason: "moderation_error" };
  }
}

/** Modère une image (URL publique ou data URI). Fail-open sur erreur API. */
export async function moderateImage(url: string): Promise<ModerationVerdict> {
  try {
    const openai = getOpenAI();
    const res = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: [{ type: "image_url", image_url: { url } }],
    });
    return toVerdict(res.results[0]);
  } catch (err) {
    console.error("[moderation] image — erreur API:", err);
    return { flagged: false, reason: "moderation_error" };
  }
}

/**
 * Journalise une décision de modération (best-effort, service_role).
 * N'interrompt jamais le flux si la clé service_role manque.
 */
export async function logModeration(params: {
  userId: string | null;
  type: ModerationType;
  passed: boolean;
  reason?: string | null;
  generationId?: string | null;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("moderation_logs").insert({
      user_id: params.userId,
      type: params.type,
      passed: params.passed,
      reason: params.reason ?? null,
      generation_id: params.generationId ?? null,
    });
  } catch (err) {
    console.error("[moderation] échec du log:", err);
  }
}

/** Message bienveillant affiché à l'utilisateur en cas de refus. */
export const MODERATION_BLOCK_MESSAGE =
  "Ta demande ne respecte pas nos conditions d'utilisation et ne peut pas être traitée. Essaie une autre photo ou une autre description.";
