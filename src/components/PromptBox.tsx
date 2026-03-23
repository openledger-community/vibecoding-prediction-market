"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";

interface PromptBoxProps {
  prompt: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  selectedCategory: string;
  onCategoryClick: () => void;
  hideDisclaimer?: boolean;
}

export default function PromptBox({
  prompt,
  onChange,
  onSubmit,
  loading,
  selectedCategory,
  onCategoryClick,
  hideDisclaimer = false
}: PromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !loading) onSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group bg-[#111218] border border-white/10 rounded-2xl p-4 transition-all focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10 shadow-lg">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search markets or profiles..."
          rows={1}
          className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-lg resize-none focus:outline-none min-h-[40px] max-h-[200px] mb-4"
        />

        {/* Bottom Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">

            {/* Category Selector */}
            <button
              onClick={onCategoryClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-sm text-gray-300 transition-all active:scale-95"
            >
              <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px]">
                <FunnelIcon className="w-3 h-3" />
              </div>
              <span className="font-medium max-w-[120px] truncate">
                {selectedCategory === "All" ? "Select Category" : selectedCategory}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={!prompt.trim() || loading}
            className={`p-2 rounded-xl transition-all shadow-lg ${prompt.trim() && !loading
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
            ) : (
              <ArrowUpIcon className="w-5 h-5 stroke-[3]" />
            )}
          </button>
        </div>
      </div>

      {!hideDisclaimer && (
        <p className="text-center text-[11px] text-gray-600 mt-4 tracking-tight">
          Predictions are market-based. Always check the primary source for verification.
        </p>
      )}
    </div>
  );
}
