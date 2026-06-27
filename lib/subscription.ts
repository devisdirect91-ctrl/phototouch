export const PREMIUM_STATUSES = ["trialing", "active", "lifetime"] as const;

/** L'utilisateur a-t-il un accès premium (essai en cours, abonné, ou lifetime) ? */
export function hasActiveSubscription(
  status: string | null | undefined,
): boolean {
  return (PREMIUM_STATUSES as readonly string[]).includes(status ?? "free");
}
