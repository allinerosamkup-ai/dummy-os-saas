import Link from "next/link";

const features = [
  {
    icon: "🧠",
    title: "Memory-driven",
    desc: "Your AI remembers every project, every decision, every context — across sessions and devices.",
  },
  {
    icon: "🔄",
    title: "Self-correcting",
    desc: "Surge-core monitors every execution. Errors are detected, diagnosed, and fixed automatically.",
  },
  {
    icon: "⚡",
    title: "One-shot intent",
    desc: "Say what you want once. The orchestrator routes to the right skills and delivers.",
  },
  {
    icon: "🔌",
    title: "Zero config",
    desc: "ConnectPro resolves OAuth, APIs, databases and credentials before you even think about it.",
  },
  {
    icon: "🏭",
    title: "Full-stack factory",
    desc: "App-factory coordinates parallel agents to build complete apps with backend, frontend and mobile.",
  },
  {
    icon: "🎨",
    title: "Visual → Code",
    desc: "Drop a screenshot or mock. Mock-to-react turns it into pixel-perfect components instantly.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For solo devs getting started",
    features: [
      "3 core skills",
      "Local memory only",
      "Community support",
      "CLI access",
    ],
    cta: "Install Free",
    href: "#install",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For serious builders",
    features: [
      "All 8 skills",
      "Cloud memory sync",
      "Priority support",
      "Custom skill slots",
      "Memory dashboard",
    ],
    cta: "Start Pro Trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    desc: "For teams building together",
    features: [
      "Everything in Pro",
      "Shared team memory",
      "Custom skills",
      "Admin dashboard",
      "SSO + audit logs",
    ],
    cta: "Contact Sales",
    href: "/signup",
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              D.U.M.M.Y.
            </span>
            <span className="text-xs text-zinc-500 font-mono">OS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-mono">
            v1.1.0 — now on npm
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Your AI.{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Never forgets.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Install once, and any AI becomes an orchestrated, self-correcting,
            memory-persistent development environment.
          </p>

          {/* Install command */}
          <div
            id="install"
            className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 font-mono text-sm mb-12"
          >
            <span className="text-zinc-500">$</span>
            <span className="text-emerald-400">npx dummy-os install</span>
            <button
              className="text-zinc-600 hover:text-white transition-colors ml-2"
              title="Copy"
            >
              📋
            </button>
          </div>

          {/* How it works */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 max-w-lg mx-auto text-left font-mono text-sm">
            <div className="text-zinc-500 mb-3">
              {"// After install, just say:"}
            </div>
            <div className="text-emerald-400 mb-4">{">"} hi dummy</div>
            <div className="text-zinc-400 space-y-2">
              <p>
                <span className="text-cyan-400">[boot]</span> Loading
                memory...
              </p>
              <p>
                <span className="text-cyan-400">[memory]</span> Found project:
                my-saas-app
              </p>
              <p>
                <span className="text-cyan-400">[orchestrator]</span> Ready.
                What do you want to build?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            8 processes. One OS.
          </h2>
          <p className="text-zinc-500 text-center mb-16 max-w-xl mx-auto">
            Each skill is a specialized process. Together, they form a
            self-correcting operating system that lives inside your AI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple pricing
          </h2>
          <p className="text-zinc-500 text-center mb-16">
            Start free. Scale when you need to.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-8 border ${
                  p.highlight
                    ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {p.highlight && (
                  <div className="text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                <p className="text-zinc-500 text-sm mb-4">{p.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-zinc-500 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <span className="text-emerald-400">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`block w-full text-center py-3 rounded-lg font-medium text-sm transition-colors ${
                    p.highlight
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">
            D.U.M.M.Y. OS — Dynamic. Unified. Multi-agent. Memory-driven.
            Yield.
          </div>
          <div className="text-sm text-zinc-600">
            Built by{" "}
            <a
              href="https://github.com/allinerosamkup-ai"
              className="text-zinc-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @allinerosamkup-ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
