"use client";

import type { Market, CategoryTags } from "@/lib/types";

interface MarketListProps {
  categoryTags: CategoryTags;
  markets: Market[];
  showVibeButton?: boolean;
  onVibeClick?: () => void;
}

export default function MarketList({ categoryTags, markets, showVibeButton, onVibeClick }: MarketListProps) {
  // categoryTags is e.g. { "Politics": "Trump,International" }
  const category = Object.keys(categoryTags)[0];
  const tags = categoryTags[category] ? categoryTags[category].split(",") : [];

  return (
    <div className="w-full mt-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Intent badge */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Category Group */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category:</span>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-bold">
              {category}
            </span>
          </div>

          {/* Tags Group */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-2 border-l border-white/10">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="bg-white/5 text-gray-400 border border-white/5 px-3 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Start Vibe Coding button */}
        {showVibeButton && (
          <button
            onClick={onVibeClick}
            className="shrink-0 relative px-6 py-2.5 rounded-full text-white font-bold text-sm transition-all active:scale-95 animate-premium-glow animate-shimmer shadow-lg shadow-indigo-500/50 border border-white/20"
          >
            Start Vibe Coding
          </button>
        )}
      </div>

      {/* Glass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 text-sm bg-white/5 rounded-2xl border border-white/10">
            No open markets found for this selection.
          </div>
        ) : (
          markets.map((m) => (
            <div
              key={m.ticker}
              className="group relative flex flex-col justify-between p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                    {m.ticker}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                <h3 className="text-gray-100 font-medium leading-snug group-hover:text-white transition-colors">
                  {m.title}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500">Volume: --</span>
                <button className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors">
                  Predict
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
