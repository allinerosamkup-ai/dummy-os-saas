import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { user_id, plan } = session.metadata;

    if (!user_id || !plan) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("profiles")
      .update({
        plan,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        plan_activated_at: new Date().toISOString(),
      })
      .eq("id", user_id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    const supabase = await createServerSupabase();
    await supabase
      .from("profiles")
      .update({ plan: "free", stripe_subscription_id: null })
      .eq("stripe_subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
