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
  "Politics": { icon: GlobeAmericasIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Sports": { icon: TrophyIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Economics": { icon: CurrencyDollarIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Crypto": { icon: BoltIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Financials": { icon: ChartBarIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Entertainment": { icon: FilmIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Climate and Weather": { icon: CloudIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Science and Technology": { icon: BeakerIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Companies": { icon: BuildingOfficeIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Elections": { icon: DocumentCheckIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Social": { icon: UsersIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  "Mentions": { icon: ChatBubbleLeftRightIcon, iconBg: "bg-slate-500/10", iconColor: "text-slate-400" },
};

const FALLBACK_ICON: IconDef = { icon: CpuChipIcon, iconBg: "bg-slate-500/10", iconColor: "text-slate-400" };

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
      <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
        Explore by Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const visibleTags = cat.tags ? cat.tags.slice(0, MAX_TAGS_VISIBLE) : [];
          const overflow = cat.tags ? cat.tags.length - MAX_TAGS_VISIBLE : 0;

          return (
            <button
              key={cat.name}
              onClick={() => onCategoryClick?.(cat.name)}
              className="group flex flex-col bg-[#0d0f16]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-[#161a24]/60 hover:border-blue-500/30 transition-all text-left shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
            >
              {/* top row: icon + name + arrow */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${cat.iconBg} shadow-inner`}>
                    <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-slate-100 font-bold group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-slate-500 text-xs font-medium mt-0.5">
                      {cat.count > 0
                        ? `${cat.count.toLocaleString()} series`
                        : "Browse markets"}
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all">
                  <ArrowRightIcon className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* tag chips row */}
              <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/5 px-3 py-1 rounded-lg group-hover:border-white/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-600 border border-white/5 px-3 py-1 rounded-lg">
                    +{overflow} more
                  </span>
                )}
                {!cat.tags && (
                  <span className="text-xs text-slate-600 italic">All topics</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
