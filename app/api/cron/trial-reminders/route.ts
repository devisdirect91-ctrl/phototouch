import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTrialEndingEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// À déclencher quotidiennement (Vercel Cron ou pg_cron → appel HTTP).
// Protège avec CRON_SECRET (header Authorization: Bearer <secret>).
export async function GET() {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = headers().get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const admin = createAdminClient();
  const now = Date.now();
  const DAY = 86_400_000;
  let sent = 0;

  for (const daysLeft of [3, 1]) {
    const start = new Date(now + (daysLeft - 0.5) * DAY).toISOString();
    const end = new Date(now + (daysLeft + 0.5) * DAY).toISOString();
    const { data: profiles } = await admin
      .from("profiles")
      .select("email")
      .eq("subscription_status", "trialing")
      .gte("trial_ends_at", start)
      .lt("trial_ends_at", end);

    for (const p of profiles ?? []) {
      if (p.email) {
        await sendTrialEndingEmail(p.email, daysLeft);
        sent += 1;
      }
    }
  }

  return NextResponse.json({ ok: true, sent });
}
