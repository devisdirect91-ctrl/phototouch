import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Enregistre une page vue (best-effort). */
export async function POST(request: Request) {
  try {
    const { path } = (await request.json().catch(() => ({}))) as {
      path?: string;
    };
    const admin = createAdminClient();
    await admin.from("page_views").insert({ path: path ?? null });
  } catch {
    // best-effort : ne jamais casser la navigation
  }
  return NextResponse.json({ ok: true });
}
