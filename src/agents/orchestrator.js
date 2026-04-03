import Anthropic from "@anthropic-ai/sdk";
import { optimizePrompt } from "../lib/promptOptimizer.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── D.U.M.M.Y. OS v2.4 System Prompt ────────────────────────────────────────
const DUMMY_OS_SYSTEM = `You are D.U.M.M.Y. OS v2.4 — Dynamic. Unified. Multi-agent. Memory-driven. Yield.

You are the kernel of an AI operating system. Your job:
1. Fase 0: Input already structured by Prompt Optimizer — use it directly
2. Route to the correct skill based on routing rules below
3. Execute the skill's core function
4. Return a structured JSON result

## Skills available
- mock-to-react: visual mocks → React pixel-perfect (COPY MODE) | UI design direction (CREATIVE MODE) | autonomous project visual analysis (SCAN MODE)
- app-factory: full-stack apps (Next.js, Expo, Node, Python)
- connectpro: integrations, OAuth, API keys, databases, .env setup
- engineering-mentor: architecture decisions, /spec /break /plan /execute Anti-Vibe Coding
- surge-core: error diagnosis and auto-correction (3 iterations max)
- preview-bridge: live preview — AUTOMATIC after any visual build, no need to be asked
- dummy-memory: session context load/save/dream/profile

## Routing rules

PRECEDENCE ORDER (apply top to bottom, first match wins):
1. Error/bug/500/blank page → surge-core IMMEDIATELY
2. Image/visual file present → mock-to-react COPY MODE
3. "analisa meu projeto" / "escaneia" / project folder → mock-to-react SCAN MODE
4. Interface request without image → mock-to-react CREATIVE MODE
5. yolo / "sem confirmação" / "auto tudo" → MODO YOLO (zero confirmations)
6. /spec /break /plan /execute / Anti-Vibe → engineering-mentor STRUCTURED MODE
7. Full app with integrations (OAuth, Supabase, Stripe) → connectpro FIRST, then app-factory
8. Full app no integrations → app-factory
9. Ambiguous/complex/PRD needed → engineering-mentor first
10. Any visual output was just created → preview-bridge AUTOMATICALLY

## Visual director rule
mock-to-react is THE visual director. engineering-mentor and app-factory NEVER create UI.
All interface work — with or without image — goes through mock-to-react.

## ONE-SHOT vs MODO YOLO
- ONE-SHOT (default): ask_minimum=true, confirm before paid resource creation
- MODO YOLO (opt-in via trigger): zero confirmations, assume suggested option always

## Autonomy boundaries
AUTOMATIC (no asking): read/detect services, validate existing credentials, create .env placeholders, install deps
CONFIRM FIRST: create paid resource (new Supabase project, cloud instance), issue permanent token
NEVER: delete data, revoke active credentials, save secret values in memory

## preview-bridge rule
After ANY HTML/JSX/TSX/component is generated → call preview-bridge automatically.
Report: "[orchestrator] build visual detectado → preview-bridge iniciando automaticamente"

## Response format
Always respond with valid JSON:
{
  "skill": "skill-name",
  "mode": "copy|creative|scan|build|spec|debug|auto",
  "action": "what you will do in 1 line",
  "result": "the actual output, code, or next steps",
  "status": "success | partial | blocked",
  "next_skill": "preview-bridge | surge-core | null",
  "preview_required": true | false
}`;

// ─── Route constants ──────────────────────────────────────────────────────────
const SKILL_MAP = {
  visual_copy:       "mock-to-react COPY MODE",
  visual_creative:   "mock-to-react CREATIVE MODE",
  visual_scan:       "mock-to-react SCAN MODE",
  app:               "app-factory-multiagent",
  integration:       "ConnectPro",
  architecture:      "engineering-mentor",
  structured:        "engineering-mentor STRUCTURED MODE",
  error:             "surge-core",
  preview:           "preview-bridge",
  other:             "engineering-mentor",
};

// ─── Fase 1: Classify intent ──────────────────────────────────────────────────
async function classifyIntent(optimizedPrompt) {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: `Classify this prompt and return ONLY valid JSON (no markdown):
{
  "route": "visual_copy|visual_creative|visual_scan|app|integration|architecture|structured|error|preview|other",
  "mode": "copy|creative|scan|build|spec|debug|auto",
  "yolo": false,
  "preview_required": false
}

Rules:
- visual_copy: image/screenshot/mock attached or referenced
- visual_creative: UI/interface requested with no image
- visual_scan: "analisa projeto", "escaneia telas", project folder
- structured: /spec /break /plan /execute mentioned
- error: bug/500/blank/crash/error
- preview_required: true if any HTML/JSX/TSX will be generated
- yolo: true if user said "yolo", "sem confirmação", "auto tudo"`,
    messages: [{ role: "user", content: optimizedPrompt }],
  });

  try {
    return JSON.parse(message.content[0].text.trim());
  } catch {
    return { route: "other", mode: "auto", yolo: false, preview_required: false };
  }
}

// ─── Fase 2: Dispatch to skill ────────────────────────────────────────────────
async function dispatch(route, mode, yolo, optimizedPrompt, context) {
  const skill = SKILL_MAP[route] || "engineering-mentor";
  const yoloNote = yolo ? "\n[MODO YOLO ACTIVE: zero confirmations, assume suggested option]" : "";

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: DUMMY_OS_SYSTEM,
    messages: [
      {
        role: "user",
        content: `[D.U.M.M.Y. OS] Skill: ${skill}${yoloNote}\nContext: ${context || "none"}\n\nTask: ${optimizedPrompt}`,
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
      preview_required: false,
    };
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────
/**
 * Run the D.U.M.M.Y. OS orchestration loop.
 *
 * Fase 0: Prompt Optimizer (haiku) → structure raw input
 * Fase 1: Classify intent (haiku) → route + mode
 * Fase 2: Dispatch to skill (sonnet) → execute + return result
 *
 * @param {string} rawInput  - Raw user input
 * @param {string} context   - Optional project context
 * @returns {object}         - { fase0, routing, skill, mode, action, result, status, next_skill, preview_required }
 */
export async function runOrchestrator(rawInput, context = "") {
  // Fase 0 — Prompt Optimizer (always visible to caller)
  const optimized = await optimizePrompt(rawInput, context);

  // Fase 1 — Classify
  const { route, mode, yolo, preview_required } = await classifyIntent(
    optimized.optimized_prompt
  );

  // Fase 2 — Dispatch
  const result = await dispatch(route, mode, yolo, optimized.optimized_prompt, context);

  return {
    fase0: optimized,
    routing: { route, mode, yolo },
    preview_required: result.preview_required ?? preview_required,
    ...result,
  };
}
