"use client";

import React from "react";

export default function MarketSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto mt-4">
            {/* Intent badge skeleton */}
            <div className="flex items-center gap-2 mb-6">
                <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                <div className="h-6 w-24 bg-indigo-500/10 rounded-full animate-pulse border border-indigo-500/10" />
                <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse border border-white/5" />
            </div>

            {/* Glass Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col justify-between p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl min-h-[160px]"
                    >
                        <div className="mb-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="h-4 w-20 bg-indigo-500/10 rounded animate-pulse" />
                                <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                            <div className="h-8 w-20 bg-white/10 rounded-lg animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
