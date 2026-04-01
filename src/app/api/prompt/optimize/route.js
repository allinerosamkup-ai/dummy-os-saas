import { createServerSupabase } from "@/lib/supabase/server";
import { optimizePrompt } from "@/lib/promptOptimizer";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { raw_input, context } = await request.json();

  if (!raw_input?.trim()) {
    return NextResponse.json({ error: "raw_input is required" }, { status: 400 });
  }

  const result = await optimizePrompt(raw_input, context);
  return NextResponse.json(result);
}
