import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é o Prompt Optimizer do D.U.M.M.Y. OS.
Sua única função: transformar qualquer input bruto em um prompt estruturado de alta qualidade.

Regras:
1. Preserve 100% da intenção original — nunca mude o que o usuário quer
2. Complete contexto implícito quando possível
3. Torne ambiguidades explícitas com a interpretação mais provável
4. Se o input já for claro e bem estruturado, retorne-o sem modificações

Retorne APENAS um JSON com este formato exato:
{
  "optimized_prompt": "o prompt estruturado e melhorado",
  "intent": "uma linha descrevendo o objetivo principal",
  "output_type": "code | design | integration | analysis | other"
}`;

export async function optimizePrompt(rawInput, context = "") {
  const userMessage = context
    ? `Contexto do projeto: ${context}\n\nInput do usuário: ${rawInput}`
    : `Input do usuário: ${rawInput}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = message.content[0].text.trim();
  return JSON.parse(text);
}
