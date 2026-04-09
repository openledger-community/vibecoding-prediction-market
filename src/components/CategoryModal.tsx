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
    "Politics": { icon: GlobeAmericasIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Sports": { icon: TrophyIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Economics": { icon: CurrencyDollarIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Crypto": { icon: BoltIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Financials": { icon: ChartBarIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Entertainment": { icon: FilmIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Climate and Weather": { icon: CloudIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Science and Technology": { icon: BeakerIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Companies": { icon: BuildingOfficeIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Elections": { icon: DocumentCheckIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Social": { icon: UsersIcon, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    "Mentions": { icon: ChatBubbleLeftRightIcon, iconBg: "bg-slate-500/10", iconColor: "text-slate-400" },
};

const FALLBACK_ICON: IconDef = { icon: CpuChipIcon, iconBg: "bg-slate-500/10", iconColor: "text-slate-400" };

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
            <div className="relative w-full max-w-4xl bg-[#0d0f16]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-slate-100">Select Category</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => { onSelect(cat.name); onClose(); }}
                            className={`group flex items-center gap-4 bg-white/5 backdrop-blur-md border rounded-2xl p-5 hover:bg-blue-600/5 transition-all text-left ${selectedCategory === cat.name
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/5 hover:border-white/20"
                                }`}
                        >
                            <div className={`p-4 rounded-xl ${cat.iconBg} shadow-inner`}>
                                <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
                            </div>
                            <div className="flex-1">
                                <div className="text-slate-100 font-bold group-hover:text-blue-400 transition-colors">
                                    {cat.name}
                                </div>
                                <div className="text-slate-500 text-xs font-medium mt-0.5">
                                    {cat.count > 0
                                        ? `${cat.count.toLocaleString()} series`
                                        : "Browse markets"}
                                </div>
                            </div>
                            {selectedCategory === cat.name && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="px-6 py-4 bg-white/5 border-t border-white/5 text-center text-xs text-slate-500 font-medium italic">
                    Select a category to refine your search results.
                </div>
            </div>
        </div>
    );
}
