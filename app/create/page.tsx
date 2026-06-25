import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/site/logo";
import { createClient } from "@/lib/supabase/server";

export default async function CreateStubPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signup");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-10">
      <Link href="/" aria-label="Accueil">
        <Logo />
      </Link>
      <div className="my-auto rounded-3xl bg-surface p-8 text-center ring-1 ring-hairline">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Bienvenue 👋
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Connecté en tant que <span className="text-ink">{user.email}</span>.
          L&apos;éditeur (upload + prompt + génération) arrive à l&apos;étape 5.
        </p>
        <p className="mt-4 break-all font-mono text-[11px] text-ink-faint">
          user.id : {user.id}
        </p>
      </div>
    </main>
  );
}
