"use client";

import {
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools,
    PromptInputImageButton,
    PromptInputSubmit
} from "../ai-elements/prompt-input";
import { Suggestions, Suggestion } from "../ai-elements/suggestion";
import { useCallback, useState } from "react";

interface ChatInputProps {
    message: string;
    setMessage: (message: string) => void;
    onSubmit: (e: React.FormEvent, attachmentUrls?: Array<{ url: string }>) => Promise<void>;
    isLoading: boolean;
    inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export function ChatInput({
    message,
    setMessage,
    onSubmit,
    isLoading,
    inputRef,
}: ChatInputProps) {
    const [attachments, setAttachments] = useState<any[]>([]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        onSubmit(e, attachments.map(a => ({ url: a.dataUrl })));
        setAttachments([]);
    }, [onSubmit, attachments]);

    return (
        <div className="p-6 bg-[#0d0f16] border-t border-white/5">
            <div className="max-w-3xl mx-auto">
                <PromptInput
                    className="relative bg-[#161a24]/40 backdrop-blur-md border border-white/5 rounded-2xl p-0 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all overflow-hidden shadow-2xl"
                    onSubmit={handleSubmit}
                    onImageDrop={(files) => console.log("files dropped", files)}
                >
                    <PromptInputTextarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Refine technical specifications..."
                        disabled={isLoading}
                        className="min-h-[64px] max-h-[200px] text-sm text-slate-200 placeholder:text-slate-600 font-medium"
                    />
                    <PromptInputToolbar className="bg-transparent px-3 pb-3">
                        <PromptInputTools>
                            <PromptInputImageButton
                                onImageSelect={(files) => console.log("files selected", files)}
                                className="text-slate-500 hover:text-blue-400 transition-colors"
                            />
                        </PromptInputTools>
                        <PromptInputSubmit
                            disabled={!message.trim() || isLoading}
                            status={isLoading ? "streaming" : "ready"}
                            size="icon"
                            className={`w-9 h-9 transition-all ${!message.trim() || isLoading ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}
                        />
                    </PromptInputToolbar>
                </PromptInput>
                <div className="text-[9px] text-slate-600 text-center mt-4 font-bold uppercase tracking-widest italic flex items-center justify-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                    Neural output generated • Verification recommended
                    <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                </div>
            </div>
        </div>
    );
}
