"use client";

import { useState } from "react";
import { DESIGN_PATTERNS, type DesignPatternId, type CategoryTags } from "@/lib/types";

interface VibeCodingFormProps {
  categoryTags: CategoryTags;
  onSubmit: (displayName: string, displayDescription: string, designPattern: DesignPatternId) => void;
  loading: boolean;
  onCancel: () => void;
}

export default function VibeCodingForm({ categoryTags, onSubmit, loading, onCancel }: VibeCodingFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [displayDescription, setDisplayDescription] = useState("");
  const [selectedPattern, setSelectedPattern] = useState<DesignPatternId | null>(null);

  // categoryTags is e.g. { "Politics": "Trump,International" }
  const category = Object.keys(categoryTags)[0];
  const tags = categoryTags[category] ? categoryTags[category].split(",") : [];

  const canSubmit = displayName.trim() && displayDescription.trim() && selectedPattern && !loading;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8 group"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <span className="font-bold text-sm">Back to results</span>
      </button>

      <div className="bg-[#111218]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Vibe <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Coding</span></h2>
            <p className="text-gray-400 text-sm max-w-md">Design and deploy your custom prediction market dashboard.</p>
          </div>

          <div className="space-y-12">
            {/* Form Fields Stack (Single Column) */}
            <div className="space-y-8">
              {/* Context */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 px-1">Target Context</label>
                <div className="flex flex-wrap items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{category}</span>
                  {tags.map((t) => (
                    <span key={t} className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>

              {/* Stacked Input Fields (One by One) */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1">App Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Trump Election Tracker"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 text-sm font-medium placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1">Short Description</label>
                  <input
                    type="text"
                    value={displayDescription}
                    onChange={(e) => setDisplayDescription(e.target.value)}
                    placeholder="e.g. Trump election dynamics..."
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 text-sm font-medium placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Design Patterns Selection (Vertical List) */}
            <div className="space-y-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1">Design System Selection</label>
              <div className="grid grid-cols-1 gap-4">
                {DESIGN_PATTERNS.map((p) => {
                  const isSelected = selectedPattern === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPattern(p.id)}
                      className={`text-left group relative p-6 rounded-2xl border transition-all duration-300 ${isSelected
                        ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20"
                        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/50" : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                          }`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <p className={`text-base font-bold ${isSelected ? "text-white" : "text-gray-300"}`}>{p.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">{p.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shrink-0 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-8 text-center max-w-xl mx-auto">
                <button
                  onClick={() => {
                    if (canSubmit) onSubmit(displayName.trim(), displayDescription.trim(), selectedPattern!);
                  }}
                  disabled={!canSubmit}
                  className={`group w-full py-5 rounded-2xl font-bold text-sm transition-all shadow-xl overflow-hidden relative ${canSubmit
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/40 active:scale-[0.98] animate-premium-glow animate-shimmer"
                    : "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-white/5"
                    }`}
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Launch App</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
