import { NextResponse } from "next/server";
import { getStripe, PLANS } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = await createServerSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await request.json();

  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: PLANS[plan].priceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/dashboard/upgrade`,
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      plan,
    },
  });

  return NextResponse.json({ url: session.url });
}
