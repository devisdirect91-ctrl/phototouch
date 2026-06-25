import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { SignupForm } from "@/components/auth/signup-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inscription" };

export default async function SignupPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/create");

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col px-5 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-radial-brand" />

      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>

      <div className="my-auto py-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-semibold text-success ring-1 ring-success/30">
          <Sparkles className="h-4 w-4" /> 7 jours gratuits
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
          Crée ton compte
        </h1>
        <p className="mt-2 text-ink-muted">
          Commence ton essai gratuit de 7 jours. Sans engagement, annulable en 1
          clic.
        </p>

        <div className="mt-7">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
