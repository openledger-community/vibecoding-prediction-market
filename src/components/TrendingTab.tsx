"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const TRENDING_DATA = [
  { rank: 1, category: "Politics", title: "Will the US take control of any part of Greenland?", volume: "$2.4M", participants: 1234, change: "+12%" },
  { rank: 2, category: "Politics", title: "How low will Trump's approval rating get before 2027?", volume: "$1.8M", participants: 892, change: "+8%" },
  { rank: 3, category: "Economics", title: "Will Bitcoin reach $150k by end of 2026?", volume: "$3.1M", participants: 2341, change: "+15%" },
  { rank: 4, category: "Technology", title: "Will there be a major AI breakthrough announced in Q1 2026?", volume: "$1.2M", participants: 567, change: "+22%" },
  { rank: 5, category: "Sports", title: "Will the Lakers win the 2026 NBA Championship?", volume: "$890K", participants: 1890, change: "+5%" },
  { rank: 6, category: "Politics", title: "Will Congress pass new AI regulation by end of 2026?", volume: "$760K", participants: 734, change: "+18%" },
];

export default function TrendingTab() {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-[0.2em] mb-1">High-Entropy Sectors</h2>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.15em]">Real-time market volatility matrix</p>
        </div>
        <div className="flex gap-1.5 bg-[#161a24]/40 border border-white/5 rounded-xl p-1 shadow-inner">
          {["24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${timeRange === range
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-slate-500 hover:text-slate-200"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {TRENDING_DATA.map((item) => (
          <div
            key={item.rank}
            className="flex items-center justify-between bg-[#0d0f16]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:bg-[#161a24]/80 hover:border-blue-500/30 transition-all duration-500 shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex-1 min-w-0 mr-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-blue-500/20">
                  Priority {item.rank}
                </span>
                <span className="text-[9px] font-bold text-slate-500 border border-white/5 px-3 py-1 rounded-lg uppercase tracking-[0.15em] bg-white/[0.02]">
                  {item.category}
                </span>
              </div>
              <h3 className="text-slate-100 font-bold text-sm leading-relaxed tracking-tight group-hover:text-white transition-colors">{item.title}</h3>
              <div className="flex flex-wrap items-center gap-5 mt-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 italic">
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-700" /> Volume: {item.volume}</span>
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-700" /> {item.participants.toLocaleString()} Nodes</span>
                <span className="text-blue-400 flex items-center gap-1.5"> <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" /> Momentum {item.change}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl transition-all uppercase tracking-widest whitespace-nowrap flex-shrink-0 active:scale-95 shadow-lg shadow-blue-500/20 border border-blue-400/20">
              Access Node <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
