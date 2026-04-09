"use client";

interface StatsRowProps {
  totalMarkets?: number;
}

export default function StatsRow({ totalMarkets }: StatsRowProps) {
  const stats = [
    {
      label: "Active Markets",
      value: totalMarkets != null ? totalMarkets.toLocaleString() : "—",
      change: null,
      positive: true,
      sub: "across 12 categories",
    },
    { label: "Total Volume", value: "$45.2M", change: "+8%", positive: true, sub: null },
    { label: "Active Users", value: "23,456", change: "+15%", positive: true, sub: null },
    { label: "Resolved Today", value: "34", change: null, positive: false, sub: "12 pending" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 mt-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[#0d0f16]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-[#161a24]/60 hover:border-blue-500/30 transition-all duration-300 shadow-lg group">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-slate-400 transition-colors">{stat.label}</h3>
          <div className="text-2xl font-bold text-slate-100 mb-1.5 group-hover:text-white transition-colors">{stat.value}</div>
          {stat.change ? (
            <div className={`text-xs font-bold ${stat.positive ? "text-emerald-400" : "text-rose-400"} flex items-center gap-1`}>
              {stat.change} <span className="text-slate-600 font-medium">this week</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">{stat.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
