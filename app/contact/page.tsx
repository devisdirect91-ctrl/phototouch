import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>
      <div className="py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Une question, un signalement, un bug ? Écris-nous à{" "}
          <a
            href="mailto:hello@phototouch.app"
            className="text-scan transition-opacity hover:opacity-80"
          >
            hello@phototouch.app
          </a>
          .
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
