"use client";

import { useState, useEffect } from "react";
import { PreviewNavBar } from "./preview-nav-bar";
import { EyeIcon, XMarkIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { CodeViewer } from "./code-viewer";
import { FileTree } from "./file-tree";

interface PreviewPanelProps {
    previewUrl?: string;
    loading?: boolean;
    error?: string | null;
    tempPreviewUrl?: string;
    refreshKey: number;
    setRefreshKey: (key: number | ((prev: number) => number)) => void;
    isFullscreen: boolean;
    setIsFullscreen: (full: boolean) => void;
    chatCollapsed: boolean;
    setChatCollapsed: (collapsed: boolean) => void;
}

export function PreviewPanel({
    previewUrl,
    loading = false,
    error,
    tempPreviewUrl = "https://demo-kzmlihs8qgbzf2usq43n.vusercontent.net",
    refreshKey,
    setRefreshKey,
    isFullscreen,
    setIsFullscreen,
    chatCollapsed,
    setChatCollapsed,
    files = [], // New prop
}: PreviewPanelProps & { files?: any[] }) {
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    // Auto-select first file if code tab is opened and no file selected
    useEffect(() => {
        if (activeTab === "code" && !selectedFile && files.length > 0) {
            // Prefer main files like page.tsx, App.tsx, index.html
            const preferred = files.find(f => f.name.endsWith("page.tsx") || f.name.endsWith("App.tsx") || f.name.endsWith("index.html"));
            setSelectedFile(preferred ? preferred.name : files[0].name);
        }
    }, [activeTab, files, selectedFile]);

    const currentFileContent = files.find(f => f.name === selectedFile)?.content || "";
    const currentLanguage = selectedFile?.endsWith(".tsx") || selectedFile?.endsWith(".ts") ? "typescript" :
        selectedFile?.endsWith(".css") ? "css" :
            selectedFile?.endsWith(".json") ? "json" :
                selectedFile?.endsWith(".html") ? "html" : "javascript";

    return (
        <div className={`flex flex-col h-full bg-black ${isFullscreen ? "fixed inset-0 z-[200]" : ""}`}>
            {/* Tabs / Header */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#0d0f16] shrink-0">
                <div className="flex items-center gap-4">
                    {/* Expand Chat Button (visible when collapsed) */}
                    {chatCollapsed && (
                        <button
                            onClick={() => setChatCollapsed(false)}
                            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                            title="Expand Chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    )}

                    {/* Tab Switcher */}
                    <div className="flex bg-[#161a24]/40 rounded-xl p-1 border border-white/5 shadow-inner">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "preview"
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-sm"
                                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                }`}
                        >
                            <EyeIcon className="w-3.5 h-3.5" />
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "code"
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-sm"
                                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                }`}
                        >
                            <CodeBracketIcon className="w-3.5 h-3.5" />
                            Code
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
                {activeTab === "preview" ? (
                    /* ── PREVIEW TAB ── */
                    <div className="absolute inset-0 flex flex-col animate-in fade-in duration-300">
                        <PreviewNavBar
                            url={previewUrl || (loading ? "" : tempPreviewUrl)}
                            onRefresh={() => setRefreshKey((k) => k + 1)}
                            onFullscreen={() => setIsFullscreen(!isFullscreen)}
                            isFullscreen={isFullscreen}
                            loading={loading}
                        />

                        <div className="flex-1 relative bg-[#06070a]">
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06070a] z-10">
                                    <iframe
                                        src={tempPreviewUrl}
                                        className="absolute inset-0 w-full h-full opacity-5 pointer-events-none grayscale blur-xl"
                                        title="Temporary Preview"
                                    />
                                    <div className="z-20 flex flex-col items-center">
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse"></div>
                                        </div>
                                        <p className="text-blue-400 font-bold text-[10px] tracking-[0.3em] uppercase animate-pulse">
                                            Rendering Instance
                                        </p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06070a] z-10 p-6">
                                    <div className="p-6 rounded-3xl bg-rose-500/10 mb-6 border border-rose-500/20 shadow-2xl backdrop-blur-xl">
                                        <XMarkIcon className="w-12 h-12 text-rose-500" />
                                    </div>
                                    <h3 className="text-slate-100 font-bold text-xl mb-2">
                                        Preview Unavailable
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium">{error}</p>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col">
                                    <div className="flex-1 relative">
                                        <iframe
                                            key={refreshKey}
                                            src={previewUrl || tempPreviewUrl}
                                            className="w-full h-full border-0 bg-white"
                                            title="Design Preview"
                                            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* ── CODE TAB ── */
                    <div className="absolute inset-0 flex bg-[#0d0f16] animate-in fade-in duration-300">
                        {/* File Tree Sidebar */}
                        <div className="w-64 border-r border-white/5 flex flex-col bg-[#0d0f16]">
                            <div className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Repository Explorer
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <FileTree
                                    files={files}
                                    selectedFile={selectedFile}
                                    onSelect={setSelectedFile}
                                />
                            </div>
                        </div>

                        {/* Code Editor Area */}
                        <div className="flex-1 flex flex-col min-w-0 bg-[#06070a]">
                            {/* File Path Header */}
                            <div className="h-10 border-b border-white/5 bg-[#0d0f16] flex items-center px-4 text-[10px] text-blue-400/80 font-bold uppercase tracking-tight">
                                <span className="text-slate-600 mr-2">$</span> {selectedFile || "System Root"}
                            </div>
                            <div className="flex-1 relative overflow-auto custom-scrollbar">
                                {selectedFile ? (
                                    <CodeViewer
                                        content={currentFileContent}
                                        language={currentLanguage}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                        Select active source file
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

