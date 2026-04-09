"use client";

import { useState } from "react";
import type { Taxonomy } from "@/lib/types";
import { ChevronDownIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface CategoryPickerProps {
  taxonomy: Taxonomy;
  onSearch: (category: string, tags: string[]) => void;
  loading: boolean;
}

export default function CategoryPicker({ taxonomy, onSearch, loading }: CategoryPickerProps) {
  const categories = Object.keys(taxonomy);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const availableTags = taxonomy[selectedCategory] || [];

  // Reset tags when category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedTags([]);
    setIsDropdownOpen(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSearch = () => {
    onSearch(selectedCategory, selectedTags);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#111218]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-blue-500/10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
              <FunnelIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-100 font-bold text-lg tracking-tight">NULL POINTER DETECTED</p>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">Narrow parameters for high-fidelity search</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Category selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 px-1">Primary Instance</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white/[0.03] border border-white/5 text-slate-100 rounded-2xl px-6 py-4 text-sm font-bold flex items-center justify-between hover:bg-white/[0.06] hover:border-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 backdrop-blur-md"
                >
                  <span className="truncate tracking-tight">{selectedCategory}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform duration-500 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1b23] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 py-2 animate-in fade-in slide-in-from-top-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`w-full text-left px-5 py-3 text-sm transition-colors ${selectedCategory === cat ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags cloud */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1">Tags (Optional)</label>
              <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl min-h-[58px]">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 transform active:scale-95 border ${isSelected
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-blue-400/30"
                          : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-200"
                          }`}
                      >
                        {tag}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-gray-600 text-xs italic px-1">No tags available for this category</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`group w-full py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl overflow-hidden relative border ${!loading
                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30 active:scale-[0.98] border-blue-400/20"
                : "bg-slate-800/50 text-slate-600 cursor-not-allowed border-white/5"
                }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Run Advanced Diagnostic</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
