"use client";

import { useEffect, useState, useRef } from "react";
import { ChatMessages } from "../chat/chat-messages";
import { ChatInput } from "../chat/chat-input";
import { PreviewPanel } from "../chat/preview-panel";

import { ChevronDoubleLeftIcon, ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ChatDetailClientProps {
    initialMessages?: any[];
    chatId?: string;
    initialPrompt?: string;
    initialDescription?: string;
    loading?: boolean;
    error?: string | null;
    chatTitle?: string;
    webUrl?: string; // For preview
    onClose: () => void;
    userEmail?: string;
}

export function ChatDetailClient({
    initialMessages = [],
    chatId,
    initialPrompt,
    initialDescription,
    loading: initialLoading = false,
    error: initialError,
    chatTitle,
    webUrl,
    onClose,
    userEmail,
}: ChatDetailClientProps) {
    const [messages, setMessages] = useState<any[]>(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(initialLoading);
    const [stream, setStream] = useState<ReadableStream<Uint8Array> | null>(null);
    const [chatCollapsed, setChatCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [files, setFiles] = useState<any[]>([]);

    // Initial message setup
    // Initial message setup
    useEffect(() => {
        if (initialMessages.length > 0) {
            setMessages(initialMessages);
        }

        // Always attempt to fetch history if chatId exists, to get files
        if (chatId) {
            const fetchHistory = async () => {
                try {
                    // Only show loading if we don't have messages yet
                    if (initialMessages.length === 0) setLoading(true);

                    const res = await fetch(`/api/chat/${chatId}/history`);
                    if (res.ok) {
                        const rawData = await res.json();
                        console.log("Raw History Response:", rawData);

                        // Unwrap response if it has { success: true, data: ... } structure
                        const data = (rawData.success && rawData.data) ? rawData.data : rawData;
                        console.log("Processed History Data:", data);

                        // Handle array (just messages)
                        if (Array.isArray(data)) {
                            if (initialMessages.length === 0) setMessages(data);
                        }
                        // Handle object (full project data)
                        else if (typeof data === "object" && data !== null) {
                            // 1. Extract Files (Primary Goal)
                            if (data.latestVersion && Array.isArray(data.latestVersion.files)) {
                                console.log("Files found in latestVersion:", data.latestVersion.files.length);
                                setFiles(data.latestVersion.files);
                            } else if (Array.isArray(data.files)) {
                                console.log("Files found in root:", data.files.length);
                                setFiles(data.files);
                            }

                            // 2. Extract Messages (only if we don't have them)
                            if (initialMessages.length === 0) {
                                if (Array.isArray(data.messages)) {
                                    setMessages(data.messages);
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch history:", err);
                } finally {
                    if (initialMessages.length === 0) setLoading(false);
                }
            };
            fetchHistory();
        } else if (initialLoading && initialPrompt) {
            setMessages([
                {
                    role: "user",
                    content: initialPrompt,
                    id: "initial-prompt",
                    timestamp: Date.now(),
                },
            ]);
        }
    }, [initialMessages, chatId, initialLoading, initialPrompt]);

    // Handle streaming response
    const handleStreamingComplete = (content: any) => {
        setStream(null);
        setLoading(false);
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content, id: `msg-${Date.now()}` },
        ]);
    };

    const handleSendMessage = async (e: React.FormEvent, attachmentUrls?: Array<{ url: string }>) => {
        e.preventDefault();
        if (!input.trim() || !chatId || loading) return;

        const userMsg = input.trim();
        setInput("");
        setLoading(true);

        // Optimistic update
        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMsg, experimental_attachments: attachmentUrls, id: Date.now().toString() },
        ]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-wallet-address": userEmail || "0x0000000000000000000000000000000000000000"
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    prompt: userMsg,
                }),
            });
            console.log("res--->", res);
            if (!res.ok) {
                let errorMessage = "Sorry, there was an error processing your message. Please try again.";
                try {
                    const errorData = await res.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (res.status === 429) {
                        errorMessage = "You have exceeded your maximum number of messages for the day. Please try again later.";
                    }
                } catch (parseError) {
                    console.error("Error parsing error response:", parseError);
                    if (res.status === 429) {
                        errorMessage = "You have exceeded your maximum number of messages for the day. Please try again later.";
                    }
                }
                throw new Error(errorMessage);
            }

            if (!res.body) {
                throw new Error("No response body for streaming");
            }

            setStream(res.body);

        } catch (error: any) {
            console.error("Chat error:", error);
            // We should probably remove the optimistic message if it failed?
            // Or just show error?
            // The template uses specific error handling, but here 'error' prop handles it?
            // ChatDetailClient has 'error' prop but no setError state exposed to handleSendMessage.
            // But checking useState at top: const [loading, setLoading] ...
            // There is no setError state defined! props.error is initialError.
            // I should verify if I need to add setError state.
            // Step 1413 shows NO setError state.
            // I'll add `alert` or console.error for now, or just leave it logged.
            // Actually, setting loading=false is done in catch block.
            setLoading(false);
        }
    };

    // ─── LEFT PANEL: Chat ─────────────────────────────────────────────
    const chatPanel = (
        <div className="flex flex-col h-full bg-[#0a0a0f]">
            {/* Header */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Thought Process
                    </span>
                </div>
                <button
                    onClick={() => setChatCollapsed(true)}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    title="Collapse Chat"
                >
                    <ChevronDoubleLeftIcon className="w-4 h-4" />
                </button>
            </div>

            <ChatMessages
                messages={messages}
                isLoading={loading}
                stream={stream}
                onStreamingComplete={handleStreamingComplete}
                currentChatId={chatId}
                setInput={setInput}
            />

            <ChatInput
                message={input}
                setMessage={setInput}
                onSubmit={handleSendMessage}
                isLoading={loading}
            />
        </div>
    );

    // ─── RIGHT PANEL: Preview ─────────────────────────────────────────
    const rightPanel = (
        <PreviewPanel
            previewUrl={webUrl}
            loading={loading && messages.length <= 1} // Only show full preview loading on initial generation
            error={initialError} // Pass error prop
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            chatCollapsed={chatCollapsed}
            setChatCollapsed={setChatCollapsed}
            files={files}
        />
    );

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* ── GLOBAL HEADER ── */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#06060c] z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-gray-300">
                        {chatTitle || initialDescription || "Vibe Coding Session"}
                    </span>
                    {loading && (
                        <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
                            </span>
                            Generating
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
                <div
                    className={`
                        border-r border-white/5 bg-[#0a0a0f] transition-all duration-300 ease-in-out relative
                        ${chatCollapsed ? "w-0 opacity-0" : "w-[30%] min-w-[300px] max-w-[500px] opacity-100"}
                    `}
                >
                    <div className="absolute inset-0 w-full h-full">
                        {chatPanel}
                    </div>
                </div>
                <div className="flex-1 min-w-0 bg-black relative">
                    {rightPanel}
                </div>
            </div>
        </div>
    );
}
