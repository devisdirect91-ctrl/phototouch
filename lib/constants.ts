export const SITE = {
  name: "PhotoTouch",
  tagline: "Transforme tes photos avec l'IA",
  description:
    "Importe une photo, décris la retouche que tu veux, et l'IA génère le résultat. Essai gratuit pendant 7 jours.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

/** Durée de l'essai gratuit, en jours. */
export const TRIAL_DAYS = 7;

/** Nombre de générations autorisées pendant l'essai gratuit (contrôle des coûts). */
export const TRIAL_GENERATION_LIMIT = Number(
  process.env.NEXT_PUBLIC_TRIAL_GENERATION_LIMIT ?? 5,
);

/** Suggestions de prompts affichées sur la page de création (chips). */
export const PROMPT_SUGGESTIONS = [
  "Change le fond",
  "Style cinématique",
  "Améliore la qualité",
  "Ambiance coucher de soleil",
  "Noir & blanc dramatique",
  "Ajoute un effet néon",
  "Portrait studio",
  "Arrière-plan flou (bokeh)",
] as const;
