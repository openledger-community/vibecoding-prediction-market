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
    <div className="w-full max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 mt-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{stat.label}</h3>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          {stat.change ? (
            <div className={`text-xs font-medium ${stat.positive ? "text-emerald-400" : "text-red-400"}`}>
              {stat.change} <span className="text-gray-500 font-normal">this week</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">{stat.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
