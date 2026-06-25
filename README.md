# PhotoTouch

Application web d'édition d'image par IA. Importe une photo, décris ta retouche, ajoute une image de référence optionnelle, et l'IA génère une nouvelle version. Modèle freemium avec essai gratuit de 7 jours.

## Stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS**
- **Supabase** — auth · base de données · storage
- **Stripe** — paiement, essai 7 jours · **Resend** — emails · **PostHog** — analytics
- **Génération** — Gemini 2.5 Flash Image (principal) / FLUX.1 Kontext via fal.ai (fallback)
- **Modération** — OpenAI Moderation (prompts) + Google Cloud Vision SafeSearch (images)
- **Framer Motion** · **lucide-react**

## Démarrage

```bash
npm install
cp .env.local.example .env.local   # puis remplis les valeurs
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande         | Rôle                  |
| ---------------- | --------------------- |
| `npm run dev`    | Serveur de dev        |
| `npm run build`  | Build de production   |
| `npm run lint`   | ESLint                |

## Design system

Charbon + spectre électrique (violet → bleu → cyan), signature « scan IA ». Tokens
définis dans [`tailwind.config.ts`](tailwind.config.ts) et [`app/globals.css`](app/globals.css).
Typos : Space Grotesk (display) · Inter (body) · JetBrains Mono (data).

## Structure (cible)

```
app/
  (marketing)/        landing + pages légales (cgu, confidentialité, contact)
  auth/               inscription / connexion
  (app)/              create · processing · result · gallery · account
  api/                generate · checkout · webhooks/stripe · billing-portal
components/ui/         primitives (Button, …)
lib/                  utils, constants, supabase, stripe, moderation, …
supabase/migrations/  schéma SQL (étape 2)
```

## Avancement

- [x] **Étape 1** — Setup projet + design system
- [ ] **Étape 2** — Migrations Supabase + auth (vérification d'âge)
- [ ] **Étape 3** — Landing
- [ ] **Étape 4** — Inscription
- [ ] **Étape 5** — Création / upload
- [ ] **Étape 6** — Modération
- [ ] **Étape 7** — API de génération (+ fallback)
- [ ] **Étape 8** — Animation d'analyse
- [ ] **Étape 9** — Résultat + paywall
- [ ] **Étape 10** — Stripe (checkout, webhooks, billing portal)
- [ ] **Étape 11** — App connectée (galerie, profil)
- [ ] **Étape 12** — Emails + analytics + pages légales
- [ ] **Étape 13** — Vérifications finales
