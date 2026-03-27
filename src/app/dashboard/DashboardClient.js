"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function PlanBadge({ plan }) {
  const colors = {
    free: "bg-zinc-800 text-zinc-400",
    pro: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    team: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase ${colors[plan] || colors.free}`}
    >
      {plan}
    </span>
  );
}

function StatusDot({ status }) {
  const color = status === "active" ? "bg-emerald-400" : "bg-zinc-600";
  return <span className={`w-2 h-2 rounded-full ${color} inline-block`} />;
}

export default function DashboardClient({
  user,
  profile,
  projects,
  licenseKeys,
}) {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="border-b border-zinc-800 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">
              D.U.M.M.Y.
            </span>
            <span className="text-xs text-zinc-500 font-mono">dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">{user.email}</span>
            <PlanBadge plan={profile?.plan || "free"} />
            {(profile?.plan || "free") === "free" && (
              <Link
                href="/dashboard/upgrade"
                className="text-sm bg-emerald-500 text-black px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-400 transition-colors"
              >
                Upgrade
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome, {profile?.display_name || user.email.split("@")[0]}
          </h1>
          <p className="text-zinc-500 text-sm">
            Manage your projects, memory sync, and license keys.
          </p>
        </div>

        {/* Upgrade banner for free users */}
        {(profile?.plan || "free") === "free" && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-emerald-300">Unlock all 8 skills + cloud memory sync</p>
              <p className="text-zinc-500 text-xs mt-0.5">Pro plan — $19/month. Activate with a license key.</p>
            </div>
            <Link
              href="/dashboard/upgrade"
              className="shrink-0 bg-emerald-500 text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Upgrade to Pro →
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="text-3xl font-bold">{projects.length}</div>
            <div className="text-sm text-zinc-500 mt-1">Projects</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="text-3xl font-bold capitalize">
              {profile?.plan || "free"}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Current Plan</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="text-3xl font-bold">{licenseKeys.length}</div>
            <div className="text-sm text-zinc-500 mt-1">Active Keys</div>
          </div>
        </div>

        {/* Projects */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          {projects.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
              <div className="text-3xl mb-3">📂</div>
              <p className="text-zinc-400 text-sm mb-2">No projects yet</p>
              <p className="text-zinc-600 text-xs font-mono">
                Run <span className="text-emerald-400">npx dummy-os init</span>{" "}
                in any project to start syncing
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot status={p.status} />
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-zinc-600 font-mono">
                        {p.git_remote || "local"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {p.stack && (
                      <span className="text-xs text-zinc-500 font-mono">
                        {p.stack}
                      </span>
                    )}
                    <span className="text-xs text-zinc-600">
                      {p.last_synced_at
                        ? `Synced ${new Date(p.last_synced_at).toLocaleDateString()}`
                        : "Never synced"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* License Keys */}
        <section>
          <h2 className="text-lg font-semibold mb-4">License Keys</h2>
          {licenseKeys.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
              <div className="text-3xl mb-3">🔑</div>
              <p className="text-zinc-400 text-sm mb-2">No active license</p>
              <p className="text-zinc-600 text-xs">
                Upgrade to Pro or Team to unlock cloud memory sync and all 8
                skills.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {licenseKeys.map((k) => (
                <div
                  key={k.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-sm text-emerald-400">
                      {k.key}
                    </div>
                    <div className="text-xs text-zinc-600 mt-1">
                      Plan: {k.plan} | Expires:{" "}
                      {k.expires_at
                        ? new Date(k.expires_at).toLocaleDateString()
                        : "Never"}
                    </div>
                  </div>
                  <PlanBadge plan={k.plan} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick start */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Quick Start</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 shrink-0">1.</span>
              <div>
                <span className="text-zinc-300">npx dummy-os install</span>
                <span className="text-zinc-600 ml-2">
                  — install skills in your AI tool
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 shrink-0">2.</span>
              <div>
                <span className="text-zinc-300">npx dummy-os init</span>
                <span className="text-zinc-600 ml-2">
                  — initialize memory in any project
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 shrink-0">3.</span>
              <div>
                <span className="text-zinc-300">hi dummy</span>
                <span className="text-zinc-600 ml-2">
                  — say this to your AI to activate the OS
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
