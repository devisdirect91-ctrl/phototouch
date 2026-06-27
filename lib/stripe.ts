import Stripe from "stripe";

let stripe: Stripe | null = null;

/** Client Stripe (serveur uniquement). */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquant — configure-le dans .env.local.");
  }
  if (!stripe) stripe = new Stripe(key);
  return stripe;
}

/** Mappe un statut d'abonnement Stripe vers nos statuts internes. */
export function mapSubscriptionStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "canceled";
    default:
      return "free";
  }
}
