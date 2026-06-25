import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = { title: "Inscription" };

export default function SignupStubPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-10">
      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>
      <div className="my-auto rounded-3xl bg-surface p-8 text-center ring-1 ring-hairline">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Crée ton compte
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          L&apos;inscription (avec vérification d&apos;âge et essai gratuit de 7
          jours) arrive à l&apos;étape 4.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-scan transition-opacity hover:opacity-80"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
