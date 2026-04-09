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
      <div className="relative group bg-[#0d0f16]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 transition-all focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-2xl">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search markets or profiles..."
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-lg resize-none focus:outline-none min-h-[40px] max-h-[200px] mb-4"
        />

        {/* Bottom Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Category selection hidden per user request */}
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={!prompt.trim() || loading}
            className={`p-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center ${prompt.trim() && !loading
              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20 active:scale-95"
              : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
            ) : (
              <ArrowUpIcon className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {!hideDisclaimer && (
        <p className="text-center text-[11px] text-slate-500 mt-4 tracking-tight font-medium">
          Predictions are market-based. Always check the primary source for verification.
        </p>
      )}
    </div>
  );
}
