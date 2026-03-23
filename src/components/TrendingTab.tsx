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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">🔥 Trending Markets</h2>
          <p className="text-gray-500 text-sm mt-0.5">Most active prediction markets right now</p>
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
          {["24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${timeRange === range ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {TRENDING_DATA.map((item) => (
          <div
            key={item.rank}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors"
          >
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full">
                  #{item.rank} Trending
                </span>
                <span className="text-xs text-gray-400 border border-white/10 px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>
              <h3 className="text-white font-medium text-sm leading-snug">{item.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>$ Volume: {item.volume}</span>
                <span>👤 {item.participants.toLocaleString()} participants</span>
                <span className="text-emerald-400 font-medium">📈 {item.change}</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0">
              View <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
