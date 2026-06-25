import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Client admin (service_role) — SERVEUR UNIQUEMENT. Bypass la RLS.
 * Ne jamais importer dans du code client : la clé service_role n'est pas exposée
 * (pas de préfixe NEXT_PUBLIC_), donc indéfinie côté navigateur.
 * À utiliser pour : webhooks Stripe, écritures de profil, logs de modération, etc.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
