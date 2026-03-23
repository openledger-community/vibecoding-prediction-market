import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
    // 1. Check Authentication
    const session = await auth();
    // Use user email as wallet address per user request
    const walletAddress = session?.user?.email || request.headers.get("x-wallet-address");

    // 2. Parse Body
    let body: { chat_id: string; prompt: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body.chat_id || !body.prompt) {
        return NextResponse.json({ error: "Missing chat_id or prompt" }, { status: 400 });
    }

    const backendApiUrl = process.env.BACKEND_API_URL;
    if (!backendApiUrl) {
        return NextResponse.json({ error: "Backend API URL not configured" }, { status: 500 });
    }

    try {
        console.log(`[api/chat] Forwarding to backend: ${backendApiUrl}/api/chat`);
        console.log(`[api/chat] Payload:`, body);

        // 3. Forward to Backend API
        const response = await fetch(`${backendApiUrl}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Pass the wallet address if available, or session email if needed by backend
                // The prompt implies x-wallet-address is important.
                ...(walletAddress ? { "x-wallet-address": walletAddress } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[api/chat] Backend Error (${response.status}):`, errorText);
            return NextResponse.json({ error: `Backend error: ${response.statusText}` }, { status: response.status });
        }

        // 4. Return Stream (assuming backend streams)
        // If backend returns stream, response.body is ReadableStream
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
            }
        });

    } catch (error) {
        console.error("[api/chat] Proxy Error:", error);
        return NextResponse.json({ error: "Failed to communicate with backend" }, { status: 500 });
    }
}
