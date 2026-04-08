import { NextResponse } from "next/server";

/**
 * GET /api/wallet/nonce
 * Proxies to the backend auth nonce endpoint.
 * Client uses this to get a fresh nonce for SIWE message signing.
 */
export async function GET() {
  const baseServerUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;
  if (!baseServerUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_BASE_SERVER_URL not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseServerUrl}/auth/nonce`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[wallet/nonce] Backend error:", err);
      return NextResponse.json({ error: "Failed to get nonce" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[wallet/nonce] Network error:", error);
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 500 });
  }
}
