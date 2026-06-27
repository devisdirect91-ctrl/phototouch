import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
};

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

export default function CguPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>

      <div className="mt-10 space-y-8">
        <header>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="mt-2 text-sm text-ink-faint">
            Dernière mise à jour : juin 2026
          </p>
        </header>

        <Section title="1. Objet">
          <p>
            PhotoTouch est un service d&apos;édition d&apos;image par
            intelligence artificielle : tu importes une photo, décris une
            transformation, et l&apos;IA génère un résultat. En utilisant le
            service, tu acceptes les présentes conditions.
          </p>
        </Section>

        <Section title="2. Compte">
          <p>
            Tu es responsable de l&apos;exactitude des informations de ton
            compte et de la confidentialité de tes identifiants. Un seul compte
            par personne.
          </p>
        </Section>

        <Section title="3. Usages interdits">
          <p>Il est strictement interdit d&apos;utiliser PhotoTouch pour :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              créer des <strong>deepfakes</strong> ou des montages de personnes
              réelles identifiables sans leur consentement ;
            </li>
            <li>harceler, intimider, menacer ou nuire à autrui ;</li>
            <li>
              générer du contenu à caractère sexuel, de la nudité, du contenu
              violent, haineux ou choquant ;
            </li>
            <li>
              produire du contenu impliquant des mineurs de manière
              inappropriée ;
            </li>
            <li>
              enfreindre des droits de propriété intellectuelle ou toute loi
              applicable.
            </li>
          </ul>
        </Section>

        <Section title="4. Modération">
          <p>
            Chaque prompt, image importée et image générée passe par une
            modération automatique. Tout contenu enfreignant ces conditions est
            bloqué et peut entraîner la suspension du compte. Nous nous réservons
            le droit de refuser ou retirer tout contenu.
          </p>
        </Section>

        <Section title="5. Contenus et propriété">
          <p>
            Tu conserves les droits sur les images que tu importes. Tu es seul
            responsable des contenus que tu soumets et de l&apos;usage des images
            générées, et tu garantis disposer des droits nécessaires.
          </p>
        </Section>

        <Section title="6. Essai gratuit et abonnement">
          <p>
            L&apos;essai gratuit dure 7 jours et nécessite une carte. Sans
            annulation avant la fin de l&apos;essai, l&apos;abonnement se
            poursuit au tarif indiqué. Tu peux annuler à tout moment depuis ton
            espace, en un clic. Nous te prévenons avant la fin de
            l&apos;essai.
          </p>
        </Section>

        <Section title="7. Résiliation">
          <p>
            Tu peux supprimer ton compte à tout moment depuis ton profil. Nous
            pouvons suspendre un compte en cas de violation des présentes
            conditions.
          </p>
        </Section>

        <Section title="8. Responsabilité">
          <p>
            Le service est fourni « en l&apos;état ». PhotoTouch ne saurait être
            tenu responsable de l&apos;usage que tu fais des images générées.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Une question ? Écris-nous à{" "}
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
