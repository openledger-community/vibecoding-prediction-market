import { NextResponse } from "next/server";
import { fetchTaxonomy } from "@/lib/kalshi";

const BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

// Server-side cache for per-category series counts (1 hour TTL)
let countsCache: Record<string, number> | null = null;
let countsCachedAt = 0;

async function fetchCategoryCounts(categories: string[]): Promise<Record<string, number>> {
  const settled = await Promise.allSettled(
    categories.map(async (cat) => {
      const res = await fetch(`${BASE_URL}/series?category=${encodeURIComponent(cat)}`);
      if (!res.ok) return { cat, count: 0 };
      const data = await res.json();
      return { cat, count: (data.series as unknown[]).length };
    })
  );

  const out: Record<string, number> = {};
  for (const s of settled) {
    if (s.status === "fulfilled") out[s.value.cat] = s.value.count;
  }
  return out;
}

export async function GET() {
  const taxonomy = await fetchTaxonomy(); // in-memory cached after first call

  // Refresh counts once per hour
  if (!countsCache || Date.now() - countsCachedAt > 3_600_000) {
    countsCache = await fetchCategoryCounts(Object.keys(taxonomy));
    countsCachedAt = Date.now();
  }

  return NextResponse.json({ taxonomy, categoryCounts: countsCache });
}
