import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runOrchestrator } from "@/agents/orchestrator";

/**
 * POST /api/agent/run
 *
 * Runs the D.U.M.M.Y. OS orchestration loop programmatically.
 *
 * Body: { input: string, context?: string }
 * Returns: { fase0, routing, skill, mode, action, result, status, next_skill }
 */
export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { input, context } = body;

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return NextResponse.json({ error: "input is required" }, { status: 400 });
  }

  const result = await runOrchestrator(input.trim(), context || "");

  return NextResponse.json(result);
}
