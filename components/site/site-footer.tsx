import Link from "next/link";
import { Logo } from "@/components/site/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link href="/cgu" className="transition-colors hover:text-ink">
              CGU
            </Link>
            <Link
              href="/confidentialite"
              className="transition-colors hover:text-ink"
            >
              Confidentialité
            </Link>
            <Link href="/contact" className="transition-colors hover:text-ink">
              Contact
            </Link>
          </nav>
        </div>
        <p className="max-w-2xl text-xs leading-relaxed text-ink-faint">
          PhotoTouch est un outil de création. L&apos;utilisation pour harceler,
          créer des deepfakes non consentis de personnes réelles, ou générer du
          contenu inapproprié est strictement interdite. Toutes les images et
          requêtes sont modérées.
        </p>
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} PhotoTouch. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
