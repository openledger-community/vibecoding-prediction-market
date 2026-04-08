import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/serverAuth";

export async function GET(request: Request) {
  const { wallet, token, authenticated } = await getServerAuth(request);
  if (!authenticated || !wallet) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch all apps for this user from the backend
  const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:4040";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-wallet-address": wallet,
    };
    if (token) {
      headers["Authorization"] = token;
    }

    const backendRes = await fetch(`${backendApiUrl}/api/applications?wallet=${encodeURIComponent(wallet)}`, {
      method: "GET",
      headers,
    });

    if (!backendRes.ok) {
      const err = await backendRes.json().catch(() => ({ error: "Backend error" }));
      return NextResponse.json({ error: err.error || "Failed to fetch apps" }, { status: backendRes.status });
    }

    const result = await backendRes.json();

    return NextResponse.json({ success: true, apps: result.data || [] });
  } catch (error) {
    console.error("[apps] Error fetching apps:", error);
    return NextResponse.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}
