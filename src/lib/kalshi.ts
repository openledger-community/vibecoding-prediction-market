import type { Taxonomy, KalshiSeries, KalshiEvent, Market, CategoryTags } from "./types";

const BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

// ── In-memory taxonomy cache ─────────────────────────────────────────────────
let taxonomyCache: Taxonomy | null = null;

export async function fetchTaxonomy(): Promise<Taxonomy> {
  if (taxonomyCache) return taxonomyCache;

  const res = await fetch(`${BASE_URL}/search/tags_by_categories`);
  if (!res.ok) throw new Error(`Taxonomy fetch failed: ${res.status}`);
  const data = await res.json();
  // Kalshi returns { tags_by_categories: { ... } }
  taxonomyCache = data.tags_by_categories as Taxonomy;
  return taxonomyCache;
}

// ── Series ───────────────────────────────────────────────────────────────────
export async function fetchSeries(
  category: string,
  tags: string[]
): Promise<KalshiSeries[]> {
  const params = new URLSearchParams();
  params.set("category", category);
  if (tags.length > 0) {
    params.set("tags", tags.join(","));
  }

  const res = await fetch(`${BASE_URL}/series?${params.toString()}`);
  if (!res.ok) throw new Error(`Series fetch failed: ${res.status}`);
  const data = await res.json();
  // Kalshi wraps in { series: [...] }
  return (data.series as KalshiSeries[]) || [];
}

// ── Events for a single series ───────────────────────────────────────────────
async function fetchOpenEvents(seriesTicker: string): Promise<Market[]> {
  const params = new URLSearchParams();
  params.set("series_ticker", seriesTicker);
  params.set("status", "open");
  params.set("limit", "200");

  const res = await fetch(`${BASE_URL}/events?${params.toString()}`);
  if (!res.ok) throw new Error(`Events fetch failed for ${seriesTicker}: ${res.status}`);
  const data = await res.json();
  // Kalshi wraps in { events: [...] }
  const events: KalshiEvent[] = data.events || [];
  return events.map((e) => ({ ticker: e.event_ticker, title: e.title }));
}

// ── Fetch open markets across multiple series (parallel, capped at 20) ──────
export async function fetchOpenMarkets(
  category: string,
  tags: string[]
): Promise<{ category_tags: CategoryTags; markets: Market[] }> {
  const seriesList = await fetchSeries(category, tags);
  const capped = seriesList.slice(0, 20);

  const results = await Promise.allSettled(
    capped.map((s) => fetchOpenEvents(s.ticker))
  );

  const markets: Market[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      markets.push(...result.value);
    }
  }

  const category_tags: CategoryTags = { [category]: tags.join(",") };
  return { category_tags, markets };
}
