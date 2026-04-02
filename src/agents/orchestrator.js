import Anthropic from "@anthropic-ai/sdk";
import { optimizePrompt } from "../lib/promptOptimizer.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DUMMY_OS_SYSTEM = `You are D.U.M.M.Y. OS — Dynamic. Unified. Multi-agent. Memory-driven. Yield.

You are the kernel of an AI operating system. Your job:
1. Interpret the user's intent
2. Route to the correct skill (mock-to-react, app-factory, ConnectPro, engineering-mentor, surge-core)
3. Execute the skill's core function
4. Return a structured result

Skills available:
- mock-to-react: visual mocks, UI design, React components
- app-factory: full-stack apps (Next.js, Expo, Node, Python)
- connectpro: integrations, OAuth, API keys, databases
- engineering-mentor: architecture decisions, spec, planning
- surge-core: error diagnosis and auto-correction
- preview-bridge: live preview and visual validation

Routing rules:
- Image/visual input → mock-to-react COPY MODE
- Interface request without image → mock-to-react CREATIVE MODE
- Full app with integrations → connectpro + app-factory
- Ambiguous/complex project → engineering-mentor first
- Error/bug → surge-core immediately

Always respond with a JSON object:
{
  "skill": "skill-name",
  "mode": "mode-name",
  "action": "what you will do",
  "result": "the actual output or next steps",
  "status": "success | partial | blocked",
  "next_skill": "next-skill-name or null"
}`;

/**
 * Classify the intent of an optimized prompt and return the routing decision.
 */
async function classifyIntent(optimizedPrompt) {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: `Classify this prompt into one of these routes and return ONLY valid JSON:
{"route": "visual|app|integration|architecture|error|other", "mode": "copy|creative|build|spec|debug|auto"}`,
    messages: [{ role: "user", content: optimizedPrompt }],
  });

  return JSON.parse(message.content[0].text.trim());
}

/**
 * Dispatch to the appropriate skill agent based on the route.
 */
async function dispatch(route, mode, optimizedPrompt, context) {
  const skillMap = {
    visual: mode === "copy" ? "mock-to-react COPY MODE" : "mock-to-react CREATIVE MODE",
    app: "app-factory-multiagent",
    integration: "ConnectPro",
    architecture: "engineering-mentor",
    error: "surge-core",
    other: "engineering-mentor",
  };

  const skill = skillMap[route] || "engineering-mentor";

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: DUMMY_OS_SYSTEM,
    messages: [
      {
        role: "user",
        content: `[D.U.M.M.Y. OS] Skill: ${skill}\nContext: ${context || "none"}\n\nTask: ${optimizedPrompt}`,
      },
    ],
  });

  const text = message.content[0].text.trim();

  try {
    return JSON.parse(text);
  } catch {
    return {
      skill,
      mode,
      action: "execute task",
      result: text,
      status: "success",
      next_skill: null,
    };
  }
}

/**
 * Main orchestrator entry point.
 * Runs Fase 0 (Prompt Optimizer) → classify → dispatch.
 */
export async function runOrchestrator(rawInput, context = "") {
  // Fase 0 — Prompt Optimizer
  const optimized = await optimizePrompt(rawInput, context);

  // Classify intent
  const { route, mode } = await classifyIntent(optimized.optimized_prompt);

  // Dispatch to skill
  const result = await dispatch(route, mode, optimized.optimized_prompt, context);

  return {
    fase0: optimized,
    routing: { route, mode },
    ...result,
  };
}
