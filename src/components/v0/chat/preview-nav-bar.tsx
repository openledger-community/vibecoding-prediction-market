"use client";

import React from "react";
import {
    ArrowTopRightOnSquareIcon,
    ArrowPathIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";

interface PreviewNavBarProps {
    url: string;
    onRefresh: () => void;
    onFullscreen: () => void;
    isFullscreen: boolean;
    loading?: boolean;
}

export function PreviewNavBar({
    url,
    onRefresh,
    onFullscreen,
    isFullscreen,
    loading = false,
}: PreviewNavBarProps) {
    return (
        <div className="h-11 flex items-center gap-2 px-4 bg-[#0d0f16] border-b border-white/5">
            {/* Traffic lights decoration */}
            <div className="flex items-center gap-1.5 mr-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40 hover:bg-rose-500 transition-colors shadow-[0_0_5px_rgba(244,63,94,0.3)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40 hover:bg-amber-500 transition-colors shadow-[0_0_5px_rgba(245,158,11,0.3)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 hover:bg-emerald-500 transition-colors shadow-[0_0_5px_rgba(16,185,129,0.3)]" />
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={onRefresh}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95"
                title="Refresh preview"
            >
                <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
            </button>

            {/* URL Bar */}
            <div className="flex-1 flex items-center gap-3 bg-[#161a24]/60 border border-white/5 rounded-lg px-4 py-1.5 min-w-0 shadow-inner group focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
                <GlobeAltIcon className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-blue-400 transition-colors" />
                <span className="text-[10px] text-slate-400 truncate leading-none">
                    {url || "awaiting genesis block..."}
                </span>
                {loading && (
                    <div className="w-2.5 h-2.5 border border-blue-500/50 border-t-blue-500 rounded-full animate-spin shrink-0 shadow-[0_0_5px_rgba(59,130,246,0.3)]" />
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={onFullscreen}
                    className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95"
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                    {isFullscreen ? (
                        <ArrowsPointingInIcon className="w-4 h-4" />
                    ) : (
                        <ArrowsPointingOutIcon className="w-4 h-4" />
                    )}
                </button>

                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-all active:scale-95"
                        title="Open in new tab"
                    >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
}
