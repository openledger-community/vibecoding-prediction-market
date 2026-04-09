import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/serverAuth";

export async function GET(request: Request, context: { params: Promise<{ chatId: string }> }) {
    const { chatId } = await context.params;
    const { wallet, token, authenticated } = await getServerAuth(request);

    if (!authenticated || !wallet) {
        console.warn(`[chat-history] Auth failed for chatId: ${chatId}. Authenticated: ${authenticated}, Wallet: ${wallet}`);
        return NextResponse.json({ error: "Not authenticated", debug: { authenticated, wallet: !!wallet } }, { status: 401 });
    }

    const backendApiUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:4040";

    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "x-wallet-address": wallet,
        };
        // Matches applications/route.ts pattern
        if (token) {
            headers["Authorization"] = token;
        }

        console.log(`[chat-history] Fetching from backend: ${backendApiUrl}/api/chat/${chatId}/history`);
        const backendRes = await fetch(`${backendApiUrl}/api/chat/${chatId}/history`, {
            method: "GET",
            headers,
        });

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            console.error(`[chat-history] Backend fetch failed for ${chatId}: ${backendRes.status}`, errorText);
            return NextResponse.json({ error: "Failed to fetch chat history" }, { status: backendRes.status });
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[chat-history] Network error fetching ${chatId}:`, error);
        return NextResponse.json({ error: "Network error" }, { status: 500 });
    }
}
