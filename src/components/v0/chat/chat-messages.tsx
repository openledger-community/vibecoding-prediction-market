"use client";

import { useEffect, useRef } from 'react';
import { Message, MessageContent, MessageAvatar } from '../ai-elements/message';
import { Loader } from '../ai-elements/loader';
import { sharedComponents, preprocessMessageContent } from '../shared/message-utils';
import { Message as SDKMessage, StreamingMessage } from '@v0-sdk/react';
import { Suggestions, Suggestion } from '../ai-elements/suggestion';

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: any;
    experimental_content?: any;
    id: string;
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    isLoading: boolean;
    stream: ReadableStream<Uint8Array> | null;
    onStreamingComplete?: (content: any) => void;
    currentChatId?: string; // To determine if we show suggestions
    setInput?: (input: string) => void; // For suggestions
}

export function ChatMessages({
    messages,
    isLoading,
    stream,
    onStreamingComplete,
    currentChatId,
    setInput,
}: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, stream, isLoading]);

    const renderMessageContent = (message: ChatMessage) => {
        const rawContent = message.experimental_content || message.content;
        const role = message.role;

        if (typeof rawContent === "string") {
            return (
                <Message from={role}>
                    <MessageAvatar name={role === "user" ? "ME" : "AI"} />
                    <MessageContent>
                        <div className="leading-relaxed whitespace-pre-wrap">
                            {rawContent}
                        </div>
                    </MessageContent>
                </Message>
            );
        }

        const processedContent = Array.isArray(rawContent)
            ? preprocessMessageContent(rawContent)
            : rawContent;

        return (
            <Message from={role}>
                <MessageAvatar name={role === "user" ? "ME" : "AI"} />
                <MessageContent>
                    <SDKMessage
                        role={role}
                        content={processedContent}
                        components={sharedComponents}
                        className="!p-0 !bg-transparent !shadow-none"
                    />
                </MessageContent>
            </Message>
        );
    };

    if (messages.length === 0 && !currentChatId) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold text-white">What can I help you build?</h1>
                </div>
                {setInput && (
                    <Suggestions className="max-w-xl">
                        <Suggestion onClick={() => setInput("Create a dashboard")} suggestion="Create a dashboard" />
                        <Suggestion onClick={() => setInput("Build a todo app")} suggestion="Build a todo app" />
                        <Suggestion onClick={() => setInput("Design a landing page")} suggestion="Design a landing page" />
                        <Suggestion onClick={() => setInput("Make a calculator")} suggestion="Make a calculator" />
                    </Suggestions>
                )}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            {messages.map((msg) => (
                <div key={msg.id}>{renderMessageContent(msg)}</div>
            ))}

            {stream && (
                <Message from="assistant">
                    <MessageAvatar name="AI" />
                    <MessageContent>
                        <StreamingMessage
                            stream={stream}
                            role="assistant"
                            messageId={`streaming-${Date.now()}`}
                            onComplete={onStreamingComplete}
                            components={sharedComponents}
                        />
                    </MessageContent>
                </Message>
            )}

            {isLoading && !stream && (
                <Message from="assistant">
                    <MessageAvatar name="AI" />
                    <MessageContent>
                        <div className="flex items-center justify-center py-2 h-6">
                            <Loader className="size-4 text-gray-500" />
                        </div>
                    </MessageContent>
                </Message>
            )}
            <div ref={bottomRef} className="pb-4" />
        </div>
    );
}
