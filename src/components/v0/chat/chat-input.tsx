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
        <div className="p-4 bg-[#0a0a0f] border-t border-white/5">
            <div className="max-w-3xl mx-auto">
                <PromptInput
                    className="relative bg-white/5 border border-white/10 rounded-2xl p-0 focus-within:ring-1 focus-within:ring-white/20 transition-all overflow-hidden"
                    onSubmit={handleSubmit}
                    onImageDrop={(files) => console.log("files dropped", files)}
                >
                    <PromptInputTextarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask a follow-up..."
                        disabled={isLoading}
                        className="min-h-[60px] max-h-[200px] text-base"
                    />
                    <PromptInputToolbar className="bg-transparent px-2 pb-2">
                        <PromptInputTools>
                            <PromptInputImageButton
                                onImageSelect={(files) => console.log("files selected", files)}
                                className="text-gray-400 hover:text-white"
                            />
                        </PromptInputTools>
                        <PromptInputSubmit
                            disabled={!message.trim() || isLoading}
                            status={isLoading ? "streaming" : "ready"}
                            size="icon"
                            className="w-8 h-8"
                        />
                    </PromptInputToolbar>
                </PromptInput>
                <div className="text-[10px] text-gray-500 text-center mt-3">
                    Vibe generated content. verify before use.
                </div>
            </div>
        </div>
    );
}
