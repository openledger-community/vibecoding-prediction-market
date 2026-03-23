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
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FunnelIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Couldn't find a match</p>
              <p className="text-gray-500 text-xs">Let's narrow it down. Pick a category and optional tags.</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Category selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1">Category</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm font-medium flex items-center justify-between hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <span className="truncate">{selectedCategory}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
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
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform active:scale-95 ${isSelected
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
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
              className={`group w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-xl overflow-hidden relative ${!loading
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/40 active:scale-[0.98]"
                : "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-white/5"
                }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Run Advanced Search</span>
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
