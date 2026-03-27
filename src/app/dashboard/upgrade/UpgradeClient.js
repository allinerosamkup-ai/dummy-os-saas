"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 core skills", "Local memory only", "Community support", "CLI access"],
    cta: "Current plan",
    disabled: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    highlight: true,
    features: [
      "All 8 skills",
      "Cloud memory sync",
      "Priority support",
      "Custom skill slots",
      "Memory dashboard",
    ],
    cta: "Activate Pro",
    disabled: false,
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Pro",
      "Shared team memory",
      "Custom skills",
      "Admin dashboard",
      "SSO + audit logs",
    ],
    cta: "Activate Team",
    disabled: false,
  },
];

export default function UpgradeClient({ user, profile }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [message, setMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const currentPlan = profile?.plan || "free";

  async function startCheckout(planId) {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setStatus("error");
        setMessage(data.error || "Checkout failed. Try again.");
        setCheckoutLoading(null);
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
      setCheckoutLoading(null);
    }
  }

  async function activateLicense(e) {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setStatus("loading");
    setMessage("");

    const supabase = createClient();

    // Check if key exists and is valid
    const { data: key, error } = await supabase
      .from("license_keys")
      .select("*")
      .eq("key", licenseKey.trim())
      .eq("active", true)
      .single();

    if (error || !key) {
      setStatus("error");
      setMessage("License key not found or already used.");
      return;
    }

    // Check if key is already claimed by another user
    if (key.user_id && key.user_id !== user.id) {
      setStatus("error");
      setMessage("This key is already activated on another account.");
      return;
    }

    // Claim the key and upgrade plan
    const { error: updateError } = await supabase
      .from("license_keys")
      .update({ user_id: user.id })
      .eq("id", key.id);

    if (updateError) {
      setStatus("error");
      setMessage("Failed to activate key. Please try again.");
      return;
    }

    // Update user profile plan
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ plan: key.plan })
      .eq("id", user.id);

    if (profileError) {
      setStatus("error");
      setMessage("Key activated but plan update failed. Contact support.");
      return;
    }

    setStatus("success");
    setMessage(`Plan upgraded to ${key.plan.toUpperCase()}! Reloading...`);
    setTimeout(() => (window.location.href = "/dashboard"), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors text-sm">
              ← Dashboard
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-sm font-medium">Upgrade Plan</span>
          </div>
          <div className="text-sm text-zinc-500">{user.email}</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-3">Upgrade your plan</h1>
          <p className="text-zinc-500">
            You&apos;re on the{" "}
            <span className="text-white font-medium capitalize">{currentPlan}</span> plan.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => !plan.disabled && !isCurrent && setSelectedPlan(plan.id)}
                className={`rounded-xl p-8 border transition-all ${
                  isCurrent
                    ? "border-zinc-700 bg-zinc-900/30 opacity-60"
                    : isSelected
                    ? "border-emerald-500 bg-emerald-500/5 cursor-pointer ring-1 ring-emerald-500"
                    : plan.highlight
                    ? "border-emerald-500/30 bg-zinc-900/50 cursor-pointer hover:border-emerald-500/60"
                    : "border-zinc-800 bg-zinc-900/50 cursor-pointer hover:border-zinc-600"
                }`}
              >
                {plan.highlight && !isCurrent && (
                  <div className="text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-4">
                    Current Plan
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-zinc-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <span className="text-emerald-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent || checkoutLoading === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCurrent && plan.id !== "free") startCheckout(plan.id);
                  }}
                  className={`w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-zinc-800 text-zinc-500 cursor-default"
                      : checkoutLoading === plan.id
                      ? "bg-emerald-500/50 text-black cursor-wait"
                      : plan.highlight
                      ? "bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                  }`}
                >
                  {isCurrent ? "Active" : checkoutLoading === plan.id ? "Redirecting..." : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* License Key Activation */}
        <div className="max-w-md mx-auto">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
            <h2 className="text-lg font-semibold mb-2">Activate a License Key</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Have a license key? Enter it below to unlock your plan instantly.
            </p>

            <form onSubmit={activateLicense} className="space-y-4">
              {status === "error" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {message}
                </div>
              )}
              {status === "success" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 text-emerald-400 text-sm">
                  {message}
                </div>
              )}

              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="DUMMY-XXXX-XXXX-XXXX"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />

              <button
                type="submit"
                disabled={status === "loading" || !licenseKey.trim()}
                className="w-full bg-emerald-500 text-black font-medium py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 text-sm"
              >
                {status === "loading" ? "Activating..." : "Activate Key"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
              <p className="text-zinc-600 text-xs">
                Need a key?{" "}
                <a
                  href="mailto:allinerosamkup@gmail.com"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Contact us
                </a>{" "}
                or wait for Stripe integration.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
