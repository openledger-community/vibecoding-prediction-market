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
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0f] shrink-0">
                <div className="flex items-center gap-3">
                    {/* Expand Chat Button (visible when collapsed) */}
                    {chatCollapsed && (
                        <button
                            onClick={() => setChatCollapsed(false)}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors mr-1"
                            title="Expand Chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    )}

                    {/* Tab Switcher */}
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "preview"
                                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <EyeIcon className="w-3.5 h-3.5" />
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "code"
                                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
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

                        <div className="flex-1 relative bg-white/5">
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06060c] z-10">
                                    <iframe
                                        src={tempPreviewUrl}
                                        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none grayscale blur-sm"
                                        title="Temporary Preview"
                                    />
                                    <div className="z-20 flex flex-col items-center">
                                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                        <p className="text-indigo-400 font-mono text-sm tracking-widest animate-pulse">
                                            GENERATING UI...
                                        </p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06060c] z-10">
                                    <div className="p-4 rounded-full bg-red-500/10 mb-4">
                                        <XMarkIcon className="w-10 h-10 text-red-500" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">
                                        Preview Unavailable
                                    </h3>
                                    <p className="text-gray-400 text-sm">{error}</p>
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
                    <div className="absolute inset-0 flex bg-[#0a0a0f] animate-in fade-in duration-300">
                        {/* File Tree Sidebar */}
                        <div className="w-60 border-r border-white/10 flex flex-col bg-[#0a0a0f]">
                            <div className="px-3 py-2.5 border-b border-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Explorer
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <FileTree
                                    files={files}
                                    selectedFile={selectedFile}
                                    onSelect={setSelectedFile}
                                />
                            </div>
                        </div>

                        {/* Code Editor Area */}
                        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f]">
                            {/* File Path Header */}
                            <div className="h-9 border-b border-white/5 bg-[#0a0a0f] flex items-center px-4 text-xs text-gray-300 font-mono">
                                {selectedFile || "Select a file"}
                            </div>
                            <div className="flex-1 relative">
                                {selectedFile ? (
                                    <CodeViewer
                                        content={currentFileContent}
                                        language={currentLanguage}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                        Select a file to view code
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

