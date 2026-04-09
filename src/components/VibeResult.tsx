"use client";

import { ChatDetailClient } from "./v0/chats/chat-detail-client";

interface VibeResultProps {
    chat: any;
    onClose: () => void;
    loading?: boolean;
    initialPrompt?: string;
    initialDescription?: string;
    error?: string | null;
    userEmail?: string;
}

export default function VibeResult(props: VibeResultProps) {
    return (
        <div className="fixed inset-0 z-[100] bg-[#06070a]">
            <ChatDetailClient
                initialMessages={props.chat?.messages}
                chatId={props.chat?.id}
                initialPrompt={props.initialPrompt}
                initialDescription={props.initialDescription}
                loading={props.loading}
                error={props.error}
                chatTitle={props.chat?.title}
                webUrl={props.chat?.latestVersion?.demoUrl}
                onClose={props.onClose}
                userEmail={props.userEmail}
            />
        </div>
    );
}
