"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface NavigationTabsProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export default function NavigationTabs({ currentTab, onTabChange }: NavigationTabsProps) {
    const tabs = [
        { name: "Search", icon: MagnifyingGlassIcon },
        { name: "Categories", icon: FunnelIcon },
    ];

    return (
    <div className="flex justify-center mb-12">
        <div className="bg-[#0d0f16]/40 backdrop-blur-md rounded-xl p-1.5 flex gap-1.5 border border-white/10 shadow-lg">
            {tabs.map((tab) => {
                const active = tab.name === currentTab;
                return (
                    <button
                        key={tab.name}
                        onClick={() => onTabChange(tab.name)}
                        className={`flex items-center gap-2.5 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${active
                            ? "bg-blue-600/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30"
                            : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                            }`}
                    >
                        <tab.icon className={`w-4.5 h-4.5 transition-colors ${active ? "text-blue-400" : "text-slate-500"}`} />
                        {tab.name}
                    </button>
                );
            })}
        </div>
    </div>
    );
}
