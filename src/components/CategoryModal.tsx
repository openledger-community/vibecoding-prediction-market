"use client";

import React from "react";
import {
    XMarkIcon,
    GlobeAmericasIcon,
    TrophyIcon,
    CurrencyDollarIcon,
    CpuChipIcon,
    FilmIcon,
    BeakerIcon,
    ArrowRightIcon,
    BoltIcon,
    ChartBarIcon,
    CloudIcon,
    BuildingOfficeIcon,
    DocumentCheckIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import type { Taxonomy } from "@/lib/types";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    taxonomy: Taxonomy | null;
    categoryCounts: Record<string, number> | null;
    onSelect: (category: string) => void;
    selectedCategory: string;
}

// ── Icon + colour per known category (Shared with CategoryGrid) ────────────────
type IconDef = { icon: React.ComponentType<{ className?: string }>; iconBg: string; iconColor: string };

const ICON_MAP: Record<string, IconDef> = {
    "Politics": { icon: GlobeAmericasIcon, iconBg: "bg-blue-500/20", iconColor: "text-blue-400" },
    "Sports": { icon: TrophyIcon, iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400" },
    "Economics": { icon: CurrencyDollarIcon, iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
    "Crypto": { icon: BoltIcon, iconBg: "bg-violet-500/20", iconColor: "text-violet-400" },
    "Financials": { icon: ChartBarIcon, iconBg: "bg-green-500/20", iconColor: "text-green-400" },
    "Entertainment": { icon: FilmIcon, iconBg: "bg-pink-500/20", iconColor: "text-pink-400" },
    "Climate and Weather": { icon: CloudIcon, iconBg: "bg-sky-500/20", iconColor: "text-sky-400" },
    "Science and Technology": { icon: BeakerIcon, iconBg: "bg-orange-500/20", iconColor: "text-orange-400" },
    "Companies": { icon: BuildingOfficeIcon, iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
    "Elections": { icon: DocumentCheckIcon, iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400" },
    "Social": { icon: UsersIcon, iconBg: "bg-teal-500/20", iconColor: "text-teal-400" },
    "Mentions": { icon: ChatBubbleLeftRightIcon, iconBg: "bg-slate-500/20", iconColor: "text-slate-400" },
};

const FALLBACK_ICON: IconDef = { icon: CpuChipIcon, iconBg: "bg-gray-500/20", iconColor: "text-gray-400" };

export default function CategoryModal({
    isOpen,
    onClose,
    taxonomy,
    categoryCounts,
    onSelect,
    selectedCategory
}: CategoryModalProps) {
    if (!isOpen) return null;

    const categories = taxonomy ? Object.keys(taxonomy).map(name => ({
        name,
        count: categoryCounts?.[name] ?? 0,
        ...(ICON_MAP[name] || FALLBACK_ICON)
    })).sort((a, b) => b.count - a.count) : [];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-[#0f1016] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-white">Select Category</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => { onSelect(cat.name); onClose(); }}
                            className={`group flex items-center gap-4 bg-white/5 backdrop-blur-md border rounded-xl p-5 hover:bg-white/10 transition-all text-left ${selectedCategory === cat.name
                                ? "border-indigo-500 bg-indigo-500/5"
                                : "border-white/10"
                                }`}
                        >
                            <div className={`p-3 rounded-lg ${cat.iconBg}`}>
                                <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                                    {cat.name}
                                </div>
                                <div className="text-gray-500 text-xs text-nowrap">
                                    {cat.count > 0
                                        ? `${cat.count.toLocaleString()} series`
                                        : "Browse markets"}
                                </div>
                            </div>
                            {selectedCategory === cat.name && (
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="px-6 py-4 bg-white/5 border-t border-white/5 text-center text-xs text-gray-500 italic">
                    Select a category to refine your search results.
                </div>
            </div>
        </div>
    );
}
