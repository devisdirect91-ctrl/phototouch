import {
  FREE_GENERATION_LIMIT,
  TRIAL_GENERATION_LIMIT,
  PAID_GENERATION_LIMIT,
} from "@/lib/constants";

export const PREMIUM_STATUSES = ["trialing", "active", "lifetime"] as const;

/** L'utilisateur a-t-il un accès payant (essai en cours, abonné, ou lifetime) ? */
export function hasActiveSubscription(
  status: string | null | undefined,
): boolean {
  return (PREMIUM_STATUSES as readonly string[]).includes(status ?? "free");
}

export type GenerationPolicy = {
  /** true = vraie génération IA ; false = bluff (pas d'appel IA). */
  real: boolean;
  /** plafond interne (non affiché). */
  cap: number;
};

/** Politique de génération selon le statut d'abonnement. */
export function generationPolicy(
  status: string | null | undefined,
): GenerationPolicy {
  switch (status) {
    case "trialing":
      return { real: true, cap: TRIAL_GENERATION_LIMIT };
    case "active":
    case "lifetime":
      return { real: true, cap: PAID_GENERATION_LIMIT };
    default:
      // free, past_due, canceled → bluff
      return { real: false, cap: FREE_GENERATION_LIMIT };
  }
}
