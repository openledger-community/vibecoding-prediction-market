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
    id: "liquid-glass",
    name: "Liquid Glass",
    description: "Frosted blur, depth, modern cleanliness",
    icon: "💧",
  },
  {
    id: "neo-skeuomorphism",
    name: "Neo-Skeuomorphism",
    description: "Tactile textures, soft shadows, realism.",
    icon: "👤",
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "Retro-futuristic, neon, grid lines.",
    icon: "🌆",
  },
  {
    id: "brutalism",
    name: "Brutalism",
    description: "Raw, bold strokes, high contrast.",
    icon: "🏗️",
  },
  {
    id: "swiss-minimal",
    name: "Swiss Minimal",
    description: "Typography-first, negative space, structured.",
    icon: "📐",
  },
  {
    id: "soft-ui",
    name: "Soft UI",
    description: "Extruded shapes, soft plastic, gentle lights.",
    icon: "☁️",
  },
  {
    id: "quantum-material",
    name: "Quantum Material",
    description: "Physics-based motion, paper layers, ink.",
    icon: "⚛️",
  },
  {
    id: "win95-retro",
    name: "Win95 Retro",
    description: "Pixel art, gray bevels, nostalgia.",
    icon: "💾",
  },
  // {
  //   id: "modern-flat",
  //   name: "Modern Flat",
  //   description: "Clean colors, no gradients, crisp vectors.",
  //   icon: "🎨",
  // },
] as const;

export type DesignPatternId = (typeof DESIGN_PATTERNS)[number]["id"];

export interface VibePayload {
  email: string;
  category_tags: CategoryTags;
  displayName: string;
  displayDescription: string;
  designPattern: DesignPatternId;
}
