import posthog from "posthog-js";

/** Envoie un event PostHog (no-op si non configuré ou côté serveur). */
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }
  try {
    posthog.capture(event, props);
  } catch {
    // ignore
  }
}
