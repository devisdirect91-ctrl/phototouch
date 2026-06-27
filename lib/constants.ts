export const SITE = {
  name: "PhotoTouch",
  tagline: "Transforme tes photos avec l'IA",
  description:
    "Importe une photo, décris la retouche que tu veux, et l'IA génère le résultat. Essai gratuit pendant 7 jours.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

/** Durée de l'essai gratuit, en jours. */
export const TRIAL_DAYS = 7;

/**
 * Plafonds internes de génération — NON affichés à l'utilisateur.
 * free  = 1 « bluff » (animation + flou, sans appel IA réel)
 * trial = 5 générations réelles
 * paid  = 30 générations réelles
 */
export const FREE_GENERATION_LIMIT = 1;
export const TRIAL_GENERATION_LIMIT = 5;
export const PAID_GENERATION_LIMIT = 30;

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

export type PlanId = "monthly" | "yearly";

export const PLANS: {
  id: PlanId;
  label: string;
  price: string;
  period: string;
  badge?: string;
}[] = [
  { id: "yearly", label: "Annuel", price: "59,99 €", period: "/an", badge: "Économise 50 %" },
  { id: "monthly", label: "Mensuel", price: "9,99 €", period: "/mois" },
];

export const PLAN_BENEFITS = [
  "Générations illimitées",
  "Haute résolution, sans watermark",
  "Tous les styles débloqués",
  "On te prévient avant la fin de l'essai",
];
