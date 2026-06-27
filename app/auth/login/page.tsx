import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/site/logo";
import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
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
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Content de te revoir
        </h1>
        <p className="mt-2 text-ink-muted">Connecte-toi pour continuer.</p>

        <div className="mt-7">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
