import Stripe from "stripe";

let _stripe;
export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    });
  }
  return _stripe;
}

export const PLANS = {
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO,
    amount: 1900,
  },
  team: {
    name: "Team",
    priceId: process.env.STRIPE_PRICE_TEAM,
    amount: 4900,
  },
};
