import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = { title: "Politique de Confidentialité" };

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>
      <div className="py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Politique de Confidentialité
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Tes données sont traitées dans le respect du RGPD. Points clés :
        </p>
        <ul className="mt-4 space-y-2 text-ink-muted">
          <li>• Les images sources sont supprimées automatiquement après 30 jours.</li>
          <li>• Tu peux supprimer ton compte et toutes tes données à tout moment.</li>
          <li>• Tes images et requêtes sont modérées pour la sécurité de tous.</li>
        </ul>
        <p className="mt-4 text-sm text-ink-faint">
          Version complète détaillée à venir (étape 12).
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-scan transition-opacity hover:opacity-80"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
