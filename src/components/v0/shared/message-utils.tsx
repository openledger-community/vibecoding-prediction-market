"use client";

import { useState } from "react";
import { type MessageBinaryFormat, type ThinkingSectionProps, type TaskSectionProps, CodeProjectPart as SDKCodeProjectPart, CodeBlock as SDKCodeBlock } from "@v0-sdk/react";
import { CodeBlock } from "./code-block";
import { CodeProjectPart } from "./code-project-part";

// ─── Message Content Preprocessing ─────────────────────────────────────────
export function preprocessMessageContent(
    content: MessageBinaryFormat
): MessageBinaryFormat {
    if (!Array.isArray(content)) return content;

    return content.map((row) => {
        if (!Array.isArray(row)) return row;

        return row.map((item) => {
            if (typeof item === "string") {
                let processed = item;
                // Remove [V0_FILE] markers
                processed = processed.replace(/\[V0_FILE\][^:]*:file="[^"]*"\n?/g, "");
                processed = processed.replace(/\[V0_FILE\][^\n]*\n?/g, "");
                // Remove shell placeholders
                processed = processed.replace(/\.\.\.?\s*shell\s*\.\.\.?/g, "");
                // Collapse excess blank lines
                processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");
                processed = processed.replace(/^\s*\n+/g, "");
                processed = processed.replace(/\n+\s*$/g, "");
                processed = processed.trim();
                return processed || "";
            }
            return item;
        }) as [number, ...any[]];
    });
}

// ─── ThinkingSection Wrapper ───────────────────────────────────────────────
export function ThinkingSectionWrapper({
    title,
    duration,
    thought,
    collapsed,
    onCollapse,
    children,
}: ThinkingSectionProps) {
    const [isOpen, setIsOpen] = useState(!collapsed);

    return (
        <div className="mb-4 border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    onCollapse?.();
                }}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-sm">🧠</span>
                    <span className="text-slate-100 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {title || "Logic Synthesis"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {duration != null && (
                        <span className="text-[10px] text-gray-500 font-mono">
                            {Math.round(duration)}s
                        </span>
                    )}
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-90" : ""}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="border-t border-white/10 p-3 text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {thought ||
                        (typeof children === "string" ? children : "Thinking...")}
                </div>
            )}
        </div>
    );
}

// ─── TaskSection Wrapper ───────────────────────────────────────────────────
export function TaskSectionWrapper({
    title,
    type,
    parts,
    collapsed,
    onCollapse,
    children,
}: TaskSectionProps) {
    const [isOpen, setIsOpen] = useState(!collapsed);

    const renderPart = (part: any, index: number) => {
        if (typeof part === "string") return <div key={index} className="text-gray-300 text-sm">{part}</div>;
        if (part && typeof part === "object") {
            if (part.type === "select-files" && Array.isArray(part.filePaths)) {
                return (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-100 flex-wrap">
                        <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest italic">Source:</span>
                        {part.filePaths.map((file: string, i: number) => (
                            <span key={i} className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-lg border border-blue-400/20 font-bold uppercase tracking-tight">{file.split("/").pop()}</span>
                        ))}
                    </div>
                );
            }
            if (part.type === "reading-file" && part.filePath) {
                return (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-100">
                        <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest italic">Scanning:</span>
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-lg border border-blue-400/20 font-bold uppercase tracking-tight">{part.filePath.split("/").pop()}</span>
                    </div>
                );
            }
            if (part.type === "code-project" && part.changedFiles) {
                return (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-100 flex-wrap">
                        <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest italic">Mutating:</span>
                        {part.changedFiles.map((file: any, i: number) => (
                            <span key={i} className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-lg border border-blue-400/20 font-bold uppercase tracking-tight">{file.fileName || file.baseName}</span>
                        ))}
                    </div>
                );
            }
            if ((part.type === "starting-repo-search" || part.type === "starting-web-search") && part.query) {
                return <div key={index} className="text-[10px] font-bold uppercase tracking-widest text-slate-100">Querying: <span className="text-blue-400 italic">&ldquo;{part.query}&rdquo;</span></div>;
            }
            if (part.type === "fetching-diagnostics") return <div key={index} className="text-sm text-gray-400">Checking for issues...</div>;
            if (part.type === "diagnostics-passed") return <div key={index} className="text-sm text-green-400">✓ No issues found</div>;
            if (part.message || part.description || part.text) return <div key={index} className="text-sm text-gray-300">{part.message || part.description || part.text}</div>;
            if (part.type) {
                const readable = part.type.replace(/-/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase());
                return <div key={index} className="text-sm text-gray-400">{readable}</div>;
            }
        }
        return null;
    };

    let displayTitle = title;
    if (!displayTitle && type) {
        displayTitle = type.replace("task-", "").replace("-v1", "").split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }

    return (
        <div className="mb-4 border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    onCollapse?.();
                }}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-indigo-400 text-sm">⚡</span>
                    <span className="text-gray-300 text-sm font-medium">{displayTitle || "Task"}</span>
                </div>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-90" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="border-t border-white/10 p-3 space-y-2">
                    {parts?.map(renderPart)}
                    {children && <div className="text-sm text-gray-300">{children}</div>}
                </div>
            )}
        </div>
    );
}

// ─── Shared Components Config ──────────────────────────────────────────────
export const sharedComponents = {
    ThinkingSection: ThinkingSectionWrapper,
    TaskSection: TaskSectionWrapper,
    CodeProjectPart: SDKCodeProjectPart,
    // Wait, V0Chat used custom CodeProjectPart imported from "./CodeProjectPart". 
    // But here I'm importing SDKCodeProjectPart... 
    // I should check V0Chat imports.
    // V0Chat: import { CodeProjectPart } from "./CodeProjectPart";
    // So I should use the custom one.
    // I need to import CodeProjectPart from "../CodeProjectPart" relative to this file?
    // This file is in src/components/v0/shared/
    // CodeProjectPart is in src/components/v0/
    // So import { CodeProjectPart } from "../CodeProjectPart"; works.
    CodeBlock,
    p: { className: "mb-3 leading-relaxed" },
    h1: { className: "text-xl font-bold text-white mb-4 mt-6" },
    h2: { className: "text-lg font-bold text-white mb-3 mt-5" },
    h3: { className: "text-base font-bold text-white mb-2 mt-4" },
    h4: { className: "text-sm font-bold text-white mb-2 mt-3" },
    h5: { className: "text-sm font-medium text-white mb-1 mt-2" },
    h6: { className: "text-sm font-medium text-white mb-1 mt-2" },
    ul: { className: "list-disc list-inside space-y-2 mb-6 text-slate-400 text-sm" },
    ol: { className: "list-decimal list-inside space-y-2 mb-6 text-slate-400 text-sm" },
    li: { className: "text-slate-300" },
    blockquote: { className: "border-l-4 border-blue-600/50 pl-6 py-2 bg-blue-600/5 italic text-slate-400 my-6 rounded-r-xl" },
    a: { className: "text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-400 transition-all font-bold" },
    strong: { className: "font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]" },
    em: { className: "italic text-slate-400" },
    hr: { className: "border-white/5 my-8 shadow-sm" },
    pre: { className: "bg-[#0d0f16] p-6 rounded-2xl overflow-x-auto my-6 font-mono text-[13px] border border-white/5 shadow-inner" },
    code: { className: "bg-blue-500/10 px-2 py-0.5 rounded-lg text-blue-400 font-bold text-[13px]" },
};
