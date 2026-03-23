"use client";

const POSITIONS = [
  { name: "Trump approval rating", position: "YES", value: "$545", change: "+9%", positive: true },
  { name: "Bitcoin $150k by EOY", position: "NO", value: "$1150", change: "-4%", positive: false },
  { name: "AI Breakthrough Q1 2026", position: "YES", value: "$310", change: "+24%", positive: true },
];

const RECENT_WINS = [
  { name: "Market 1", amount: "+$120" },
  { name: "Market 2", amount: "+$120" },
  { name: "Market 3", amount: "+$120" },
  { name: "Market 4", amount: "+$85" },
];

const WATCHLIST = [
  { name: "Watched Market 1" },
  { name: "Watched Market 2" },
  { name: "Watched Market 3" },
  { name: "Watched Market 4" },
];

export default function PortfolioTab() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 border border-indigo-500/50 rounded-xl p-5">
          <h3 className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-2">Total Value</h3>
          <div className="text-2xl font-bold text-white">$12,450</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Active Markets</h3>
          <div className="text-2xl font-bold text-white">8</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Total Return</h3>
          <div className="text-2xl font-bold text-emerald-400">+23.5%</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Win Rate</h3>
          <div className="text-2xl font-bold text-white">68%</div>
        </div>
      </div>

      {/* Active Positions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white">Active Positions</h2>
        <p className="text-gray-500 text-sm mb-5">Your current market positions</p>
        <div className="flex flex-col divide-y divide-white/5">
          {POSITIONS.map((pos) => (
            <div key={pos.name} className="flex items-center justify-between py-4">
              <div>
                <div className="text-white font-medium">{pos.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">Position:</span>
                  <span
                    className={`text-xs border px-2.5 py-0.5 rounded-full ${pos.position === "YES"
                        ? "border-emerald-500/50 text-emerald-400"
                        : "border-gray-500/50 text-gray-400"
                      }`}
                  >
                    {pos.position}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="text-white font-semibold">{pos.value}</div>
                  <div className={`text-xs font-medium ${pos.positive ? "text-emerald-400" : "text-red-400"}`}>
                    {pos.change}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white text-sm transition-colors">Manage</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Wins + Watchlist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Wins</h2>
          <div className="flex flex-col divide-y divide-white/5">
            {RECENT_WINS.map((win) => (
              <div key={win.name} className="flex items-center justify-between py-3">
                <span className="text-white text-sm">{win.name}</span>
                <span className="text-emerald-400 text-sm font-semibold">{win.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Watchlist</h2>
          <div className="flex flex-col divide-y divide-white/5">
            {WATCHLIST.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-3">
                <span className="text-white text-sm">{item.name}</span>
                <button className="text-gray-400 hover:text-white text-sm transition-colors">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
