import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKETS = ["user-uploads", "references", "results"];

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const admin = createAdminClient();

  // Supprime les fichiers stockés sous <user_id>/ dans chaque bucket
  for (const bucket of BUCKETS) {
    const { data: files } = await admin.storage.from(bucket).list(user.id);
    if (files && files.length > 0) {
      await admin.storage
        .from(bucket)
        .remove(files.map((f) => `${user.id}/${f.name}`));
    }
  }

  // Supprime l'utilisateur auth → cascade profiles → generations
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json(
      { error: "La suppression a échoué." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
