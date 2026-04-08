import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/serverAuth";
import { fetchTaxonomy, fetchOpenMarkets } from "@/lib/kalshi";
import { classifyPrompt } from "@/lib/openai";
import type { SearchBody, Taxonomy } from "@/lib/types";

// Validate & clamp category/tags against the real taxonomy.
function validateAgainstTaxonomy(
  category: string,
  tags: string[],
  taxonomy: Taxonomy
): { category: string; tags: string[] } | null {
  const validCategory = Object.keys(taxonomy).find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
  if (!validCategory) return null;

  const allowedTags = taxonomy[validCategory];
  if (!allowedTags) {
    return { category: validCategory, tags: [] };
  }

  const allowedSet = new Set(allowedTags.map((t) => t.toLowerCase()));
  const validTags = tags.filter((t) => allowedSet.has(t.toLowerCase()));
  const canonicalTags = validTags.map(
    (t) => allowedTags.find((a) => a.toLowerCase() === t.toLowerCase()) || t
  );

  return { category: validCategory, tags: canonicalTags };
}

export async function POST(request: Request) {
  const { authenticated } = await getServerAuth(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: SearchBody;
  try {
    body = (await request.json()) as SearchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const taxonomy = await fetchTaxonomy();

  // ── Path A: prompt provided → LLM classification ─────────────────────────
  if (body.prompt) {
    if (!body.prompt.trim()) {
      return NextResponse.json({ error: "Prompt cannot be empty" }, { status: 400 });
    }

    const classification = await classifyPrompt(body.prompt.trim(), taxonomy);

    if (!classification.confident) {
      return NextResponse.json({ fallback: true, taxonomy });
    }

    const validated = validateAgainstTaxonomy(
      classification.category,
      classification.tags,
      taxonomy
    );

    if (!validated) {
      return NextResponse.json({ fallback: true, taxonomy });
    }

    const result = await fetchOpenMarkets(validated.category, validated.tags);
    return NextResponse.json(result);
  }

  // ── Path B: manual category + tags (from picker) ─────────────────────────
  if (body.category) {
    const tags = body.tags || [];
    const validated = validateAgainstTaxonomy(body.category, tags, taxonomy);

    if (!validated) {
      return NextResponse.json(
        { error: `Invalid category: ${body.category}` },
        { status: 400 }
      );
    }

    const result = await fetchOpenMarkets(validated.category, validated.tags);
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { error: "Provide either 'prompt' or 'category' in the body" },
    { status: 400 }
  );
}
