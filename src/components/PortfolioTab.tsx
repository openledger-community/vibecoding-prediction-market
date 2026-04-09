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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
          <h3 className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Net Asset Value</h3>
          <div className="text-2xl font-bold text-white tracking-tight">$12,450.00</div>
        </div>
        <div className="bg-[#161a24]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Nodes Active</h3>
          <div className="text-2xl font-bold text-slate-100 tracking-tight">08</div>
        </div>
        <div className="bg-[#161a24]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Yield Rate</h3>
          <div className="text-2xl font-bold text-blue-400 tracking-tight">+23.5%</div>
        </div>
        <div className="bg-[#161a24]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Efficiency</h3>
          <div className="text-2xl font-bold text-slate-100 tracking-tight">68%</div>
        </div>
      </div>

      {/* Active Positions */}
      <div className="bg-[#0d0f16]/60 backdrop-blur-3xl border border-white/5 rounded-2xl p-8 mb-8 shadow-2xl">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-1">Active Vectors</h2>
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 italic">Live market exposure telemetry</p>
        <div className="flex flex-col divide-y divide-white/5">
          {POSITIONS.map((pos) => (
            <div key={pos.name} className="flex items-center justify-between py-5 group">
              <div>
                <div className="text-slate-200 font-bold tracking-tight group-hover:text-blue-400 transition-colors text-sm">{pos.name}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">State:</span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-[0.15em] border px-3 py-1 rounded-lg ${pos.position === "YES"
                      ? "border-blue-500/30 text-blue-400 bg-blue-500/5 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                      : "border-slate-500/30 text-slate-500 bg-slate-500/5"
                      }`}
                  >
                    {pos.position}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-slate-100 font-bold tracking-tight">{pos.value}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${pos.positive ? "text-blue-400" : "text-rose-500"}`}>
                    {pos.change}
                  </div>
                </div>
                <button className="text-slate-600 hover:text-blue-400 text-[10px] font-bold uppercase tracking-widest transition-all p-2 rounded-lg hover:bg-blue-500/10 active:scale-95">Action</button>
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
