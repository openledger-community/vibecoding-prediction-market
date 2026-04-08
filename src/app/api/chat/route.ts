import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWalletAuth } from "@/lib/walletAuth";

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

export async function POST(request: Request) {
  // Auth check: accept either wallet header or next-auth session
  const walletAddress =
    request.headers.get("x-wallet-address") ||
    (isWalletMode ? null : null);
  const authHeader = request.headers.get("Authorization");

  // Fall back to next-auth session for google mode
  let resolvedWallet = walletAddress;
  if (!resolvedWallet && !isWalletMode) {
    const session = await auth();
    resolvedWallet = session?.user?.email || null;
  }

  // Parse Body
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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (resolvedWallet) headers["x-wallet-address"] = resolvedWallet;
    if (authHeader) headers["Authorization"] = authHeader;

    const response = await fetch(`${backendApiUrl}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[api/chat] Backend Error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("[api/chat] Proxy Error:", error);
    return NextResponse.json({ error: "Failed to communicate with backend" }, { status: 500 });
  }
}
