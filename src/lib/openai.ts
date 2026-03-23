import OpenAI from "openai";
import type { LLMClassification, Taxonomy } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT_TEMPLATE = `You are a classification assistant for Kalshi, a prediction-market platform.

Given a user's natural-language prompt, your job is to map it to the best matching category and tags from the taxonomy below.

TAXONOMY:
{taxonomy}

RULES:
- Pick exactly ONE category.
- Pick ALL tags from that category that are relevant to the user's prompt. Do NOT limit yourself to one tag — if the prompt touches multiple topics within the category, include every matching tag.
- If the category has no tags (null), return an empty tags array.
- Set "confident" to true ONLY if the prompt is clearly about a prediction-market topic (politics, sports, weather, finance, crypto, etc.).
- Set "confident" to false if the prompt is unrelated to prediction markets (e.g. "write a poem", "help me code", "tell me a joke").
- Do NOT hallucinate category or tag names. Only use values from the taxonomy exactly as written.

EXAMPLES of good multi-tag matching:
- "Trump approval and US election polls" → category: Politics, tags: ["Trump", "US Elections"]
- "Bitcoin and Ethereum prices" → category: Crypto, tags: ["BTC", "ETH"]
- "NBA and NFL playoffs" → category: Sports, tags: ["Basketball", "Football"]

Respond with valid JSON only, no extra text:
{{"category": "<category name>", "tags": ["<tag1>", "<tag2>", ...], "confident": true|false}}`;

export async function classifyPrompt(
  prompt: string,
  taxonomy: Taxonomy
): Promise<LLMClassification> {
  const taxonomyJson = JSON.stringify(taxonomy, null, 2);
  const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace("{taxonomy}", taxonomyJson);

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    temperature: 0,
    max_tokens: 200,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content) as LLMClassification;

  // Defensive: ensure shape
  return {
    category: parsed.category || "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    confident: parsed.confident === true,
  };
}
