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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Intent badge */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Category Group */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Instance:</span>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider">
              {category}
            </span>
          </div>

          {/* Tags Group */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 pl-4 border-l border-white/5">Vectors:</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-slate-800/40 text-slate-400 border border-white/5 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-tight">
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
            className="shrink-0 relative px-8 py-2.5 rounded-xl text-white font-bold text-[11px] uppercase tracking-[0.15em] transition-all active:scale-95 animate-premium-glow animate-shimmer shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-400/20 bg-blue-600"
          >
            Terminal Interface
          </button>
        )}
      </div>

      {/* Glass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {markets.length === 0 ? (
          <div className="col-span-full p-16 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] bg-white/[0.02] rounded-2xl border border-white/5 backdrop-blur-3xl">
            No active nodes detected in this sector
          </div>
        ) : (
          markets.map((m) => (
            <div
              key={m.ticker}
              className="group relative flex flex-col justify-between p-6 bg-[#0d0f16]/60 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-[#161a24]/80 hover:border-blue-500/30 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5"
            >
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="font-bold text-[9px] uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                    {m.ticker}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
                </div>
                <h3 className="text-slate-100 font-bold leading-relaxed tracking-tight group-hover:text-white transition-colors text-sm">
                  {m.title}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Volume: 0.00</span>
                <button className="text-[10px] font-bold bg-white/5 hover:bg-blue-600 hover:text-white text-slate-400 px-5 py-2.5 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all active:scale-95 uppercase tracking-widest">
                  Investigate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
