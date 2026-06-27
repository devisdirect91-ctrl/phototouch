import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { TRIAL_DAYS } from "@/lib/constants";

export const runtime = "nodejs";

function priceFor(plan: unknown): string | undefined {
  if (plan === "monthly") return process.env.STRIPE_PRICE_MONTHLY || undefined;
  if (plan === "yearly") return process.env.STRIPE_PRICE_YEARLY || undefined;
  return undefined;
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { plan, generationId } = (await request.json().catch(() => ({}))) as {
    plan?: string;
    generationId?: string;
  };
  const priceId = priceFor(plan);
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Offre indisponible : le price ID Stripe n'est pas configuré dans .env.local (STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY).",
      },
      { status: 400 },
    );
  }

  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    const stripe = getStripe();

    let customerId = profile?.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? profile?.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = new URL(request.url).origin;
    const back = generationId
      ? `${origin}/result?id=${generationId}`
      : `${origin}/create`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: { supabase_user_id: user.id },
      },
      success_url: back,
      cancel_url: back,
      allow_promotion_codes: true,
      metadata: { supabase_user_id: user.id },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session Stripe créée sans URL." },
        { status: 500 },
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    const message =
      err instanceof Error ? err.message : "Erreur lors du paiement.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
