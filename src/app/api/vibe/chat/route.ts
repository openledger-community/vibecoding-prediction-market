import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { v0 } from "v0-sdk";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let body: { chatId: string; message: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body.chatId || !body.message) {
        return NextResponse.json({ error: "Missing chatId or message" }, { status: 400 });
    }

    try {
        console.log(`[vibe-chat] Streaming message to chat ${body.chatId}: ${body.message}`);

        // Call V0 SDK to send message with streaming enabled
        // Cast to any to bypass strict type checking for experimental_stream if types are outdated
        const stream = await v0.chats.sendMessage({
            chatId: body.chatId,
            message: body.message,
            responseMode: "experimental_stream",
        }) as any;

        // Return the stream directly to the client
        return new NextResponse(stream, {
            headers: {
                "Content-Type": "application/octet-stream",
            }
        });

    } catch (error) {
        console.error("V0 SDK Chat Error:", error);
        return NextResponse.json({ error: "Failed to send message to V0" }, { status: 500 });
    }
}
