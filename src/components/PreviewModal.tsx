"use client";

import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface PreviewModalProps {
    url: string | null;
    onClose: () => void;
}

export default function PreviewModal({ url, onClose }: PreviewModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (url) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [url]);

    if (!url) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Glassmorphism */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-[85vh] bg-[#0f1016] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                            <span className="text-2xl">⚡</span> Preview Generated Design
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Your custom prediction market UI is ready</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all transform hover:rotate-90 active:scale-95"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Area (Iframe) */}
                <div className="flex-1 bg-black relative">
                    <iframe
                        src={url}
                        className="w-full h-full border-0"
                        title="Design Preview"
                        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
                    />

                    {/* Subtle overlay to prevent interaction with iframe while appearing */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="px-2 py-1 rounded bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Live Preview
                        </div>
                    </div>
                    <button
                        onClick={() => window.open(url, '_blank')}
                        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
                    >
                        Open in New Tab
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
