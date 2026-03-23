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
        <div className="h-11 flex items-center gap-2 px-3 bg-[#0d0d14] border-b border-white/5">
            {/* Traffic lights decoration */}
            <div className="flex items-center gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={onRefresh}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Refresh preview"
            >
                <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* URL Bar */}
            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 min-w-0">
                <GlobeAltIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="text-xs text-gray-400 truncate font-mono">
                    {url || "Your app will appear here..."}
                </span>
                {loading && (
                    <div className="w-3 h-3 border border-indigo-500/50 border-t-indigo-500 rounded-full animate-spin shrink-0" />
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onFullscreen}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                    {isFullscreen ? (
                        <ArrowsPointingInIcon className="w-3.5 h-3.5" />
                    ) : (
                        <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                    )}
                </button>

                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        title="Open in new tab"
                    >
                        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </a>
                )}
            </div>
        </div>
    );
}
