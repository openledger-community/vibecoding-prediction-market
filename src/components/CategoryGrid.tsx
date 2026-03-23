"use client";

import {
  GlobeAmericasIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  CpuChipIcon,
  FilmIcon,
  BeakerIcon,
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  CloudIcon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import type { Taxonomy } from "@/lib/types";

interface CategoryGridProps {
  taxonomy?: Taxonomy | null;
  categoryCounts?: Record<string, number> | null;
  onCategoryClick?: (category: string) => void;
}

// ── Icon + colour per known category ────────────────────────────────────────
type IconDef = { icon: React.ComponentType<{ className?: string }>; iconBg: string; iconColor: string };

const ICON_MAP: Record<string, IconDef> = {
  "Politics": { icon: GlobeAmericasIcon, iconBg: "bg-blue-500/20", iconColor: "text-blue-400" },
  "Sports": { icon: TrophyIcon, iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400" },
  "Economics": { icon: CurrencyDollarIcon, iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
  "Crypto": { icon: BoltIcon, iconBg: "bg-violet-500/20", iconColor: "text-violet-400" },
  "Financials": { icon: ChartBarIcon, iconBg: "bg-green-500/20", iconColor: "text-green-400" },
  "Entertainment": { icon: FilmIcon, iconBg: "bg-pink-500/20", iconColor: "text-pink-400" },
  "Climate and Weather": { icon: CloudIcon, iconBg: "bg-sky-500/20", iconColor: "text-sky-400" },
  "Science and Technology": { icon: BeakerIcon, iconBg: "bg-orange-500/20", iconColor: "text-orange-400" },
  "Companies": { icon: BuildingOfficeIcon, iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
  "Elections": { icon: DocumentCheckIcon, iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400" },
  "Social": { icon: UsersIcon, iconBg: "bg-teal-500/20", iconColor: "text-teal-400" },
  "Mentions": { icon: ChatBubbleLeftRightIcon, iconBg: "bg-slate-500/20", iconColor: "text-slate-400" },
};

const FALLBACK_ICON: IconDef = { icon: CpuChipIcon, iconBg: "bg-gray-500/20", iconColor: "text-gray-400" };

const MAX_TAGS_VISIBLE = 5;

export default function CategoryGrid({ taxonomy, categoryCounts, onCategoryClick }: CategoryGridProps) {
  // ── loading skeleton while taxonomy fetches ──────────────────────────────
  if (!taxonomy) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Explore by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ── sorted by series count descending ─────────────────────────────────────
  const categories = Object.keys(taxonomy)
    .map((name) => ({
      name,
      tags: taxonomy[name],          // string[] | null
      count: categoryCounts?.[name] ?? 0,
      ...(ICON_MAP[name] || FALLBACK_ICON),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Explore by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const visibleTags = cat.tags ? cat.tags.slice(0, MAX_TAGS_VISIBLE) : [];
          const overflow = cat.tags ? cat.tags.length - MAX_TAGS_VISIBLE : 0;

          return (
            <button
              key={cat.name}
              onClick={() => onCategoryClick?.(cat.name)}
              className="group flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all text-left"
            >
              {/* top row: icon + name + arrow */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${cat.iconBg}`}>
                    <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {cat.count > 0
                        ? `${cat.count.toLocaleString()} series`
                        : "Browse markets"}
                    </div>
                  </div>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* tag chips row */}
              <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/10 text-gray-300 border border-white/10 px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="text-xs bg-white/5 text-gray-500 border border-white/5 px-2.5 py-0.5 rounded">
                    +{overflow} more
                  </span>
                )}
                {!cat.tags && (
                  <span className="text-xs text-gray-600 italic">All topics</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
