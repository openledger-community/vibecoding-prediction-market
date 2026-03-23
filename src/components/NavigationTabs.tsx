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
        <div className="flex justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-1 flex gap-1 border border-white/10">
                {tabs.map((tab) => {
                    const active = tab.name === currentTab;
                    return (
                        <button
                            key={tab.name}
                            onClick={() => onTabChange(tab.name)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${active
                                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/5"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
