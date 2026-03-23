// Taxonomy: category name → array of tag strings, or null if no tags
export type Taxonomy = Record<string, string[] | null>;

// What the LLM returns after classification
export interface LLMClassification {
  category: string;
  tags: string[];
  confident: boolean;
}

// A single market result
export interface Market {
  ticker: string;
  title: string;
}

// { "Politics": "Trump,International" }
export type CategoryTags = Record<string, string>;

// Successful response from POST /api/search
export interface SearchSuccessResponse {
  category_tags: CategoryTags;
  markets: Market[];
}

// Fallback response when LLM can't match
export interface SearchFallbackResponse {
  fallback: true;
  taxonomy: Taxonomy;
}

export type SearchResponse = SearchSuccessResponse | SearchFallbackResponse;

// POST body variants
export interface SearchPromptBody {
  prompt: string;
  category?: undefined;
  tags?: undefined;
}

export interface SearchManualBody {
  category: string;
  tags?: string[];
  prompt?: undefined;
}

export type SearchBody = SearchPromptBody | SearchManualBody;

// Raw Kalshi API shapes (only fields we use)
export interface KalshiSeries {
  ticker: string;
  title: string;
  category: string;
  tags: string[] | null;
}

export interface KalshiEvent {
  event_ticker: string;
  title: string;
}

// ── Vibe Coding ───────────────────────────────────────────────────────────────

export const DESIGN_PATTERNS = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean lines, generous whitespace, strong typography",
    icon: "◻️",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Data-dense layout with KPIs and summary cards",
    icon: "📊",
  },
  {
    id: "news-feed",
    name: "News Feed",
    description: "Scrollable list with timestamps and previews",
    icon: "📰",
  },
  {
    id: "dark-analytics",
    name: "Dark Analytics",
    description: "Dark theme with neon accents, real-time feel",
    icon: "📈",
  },
  {
    id: "card-grid",
    name: "Card Grid",
    description: "Responsive grid of information cards",
    icon: "🃏",
  },
  {
    id: "ticker-strip",
    name: "Ticker Strip",
    description: "Financial-terminal style, compact data rows",
    icon: "💹",
  },
  {
    id: "liquid-glass",
    name: "Liquid Glass",
    description: "Frosted blur, translucent layers, iOS-like depth",
    icon: "💧",
  },
  {
    id: "antique-brass",
    name: "Antique Brass",
    description: "Warm metallics, serif fonts, steampunk/classic finance vibe",
    icon: "🕰️",
  },
] as const;

export type DesignPatternId = (typeof DESIGN_PATTERNS)[number]["id"];

export interface VibePayload {
  email: string;
  category_tags: CategoryTags;
  displayName: string;
  displayDescription: string;
  designPattern: DesignPatternId;
}
