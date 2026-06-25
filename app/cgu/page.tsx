import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = { title: "Conditions Générales d'Utilisation" };

export default function CguPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>
      <div className="py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          PhotoTouch est un outil de création d&apos;image par IA. En
          l&apos;utilisant, tu acceptes les interdictions suivantes :
        </p>
        <ul className="mt-4 space-y-2 text-ink-muted">
          <li>• Créer des deepfakes non consentis de personnes réelles.</li>
          <li>• Harceler, intimider ou nuire à autrui.</li>
          <li>• Générer du contenu sexuel, violent ou inapproprié.</li>
          <li>• Toute utilisation illégale du service.</li>
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
