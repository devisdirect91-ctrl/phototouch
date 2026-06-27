import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = { title: "Politique de Confidentialité" };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed text-ink-muted">
        {children}
      </div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>

      <div className="mt-10 space-y-8">
        <header>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Politique de Confidentialité
          </h1>
          <p className="mt-2 text-sm text-ink-faint">
            Dernière mise à jour : juin 2026
          </p>
        </header>

        <Section title="1. Données que nous collectons">
          <ul className="list-disc space-y-1 pl-5">
            <li>Compte : email, date de création.</li>
            <li>
              Création : images importées, images de référence, prompts, images
              générées.
            </li>
            <li>Paiement : géré par Stripe (nous ne stockons pas ta carte).</li>
            <li>Usage : statistiques d&apos;utilisation anonymisées.</li>
          </ul>
        </Section>

        <Section title="2. Finalités">
          <p>
            Fournir le service (génération, galerie), assurer la sécurité et la
            modération, gérer l&apos;abonnement, et améliorer le produit.
          </p>
        </Section>

        <Section title="3. Modération">
          <p>
            Tes prompts et images sont analysés automatiquement pour bloquer les
            contenus interdits (nudité, violence, deepfakes non consentis,
            harcèlement). Des journaux de modération sont conservés à des fins de
            sécurité.
          </p>
        </Section>

        <Section title="4. Sous-traitants">
          <p>
            Nous nous appuyons sur des prestataires conformes au RGPD :
            Supabase (base de données et stockage), Stripe (paiement), OpenAI
            (génération et modération), Resend (emails), PostHog (analytics).
          </p>
        </Section>

        <Section title="5. Conservation">
          <p>
            Les images sources sont automatiquement supprimées après{" "}
            <strong>30 jours</strong>. Les autres données sont conservées tant
            que ton compte est actif.
          </p>
        </Section>

        <Section title="6. Tes droits (RGPD)">
          <p>
            Tu peux accéder à tes données, les rectifier, et{" "}
            <strong>supprimer ton compte et toutes tes données</strong> à tout
            moment depuis ton profil. Tu disposes également d&apos;un droit
            d&apos;opposition et de portabilité.
          </p>
        </Section>

        <Section title="7. Sécurité">
          <p>
            Accès restreint par des règles de sécurité au niveau des lignes
            (RLS), buckets de stockage privés, et clés secrètes côté serveur
            uniquement.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            Pour toute demande relative à tes données :{" "}
            <a
              href="mailto:hello@phototouch.app"
              className="text-scan hover:opacity-80"
            >
              hello@phototouch.app
            </a>
            .
          </p>
        </Section>

        <p className="rounded-2xl bg-surface p-4 text-xs leading-relaxed text-ink-faint ring-1 ring-hairline">
          Ce document est un modèle et ne constitue pas un avis juridique. Fais-le
          relire par un professionnel avant mise en production.
        </p>

        <Link
          href="/"
          className="inline-block text-sm text-scan transition-opacity hover:opacity-80"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
