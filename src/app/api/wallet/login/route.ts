import { NextResponse } from "next/server";

/**
 * POST /api/wallet/login
 * Receives SIWE { message, signature, public_key } from the client,
 * proxies to the backend auth/login endpoint, and returns the auth token + address.
 */
export async function POST(request: Request) {
  const baseServerUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;
  if (!baseServerUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_BASE_SERVER_URL not configured" }, { status: 500 });
  }

  let body: { message: unknown; signature: string; public_key: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.message || !body.signature || !body.public_key) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const res = await fetch(`${baseServerUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: body.message,
        signature: body.signature,
        public_key: body.public_key,
      }),
    });
    console.log("[wallet/login] Backend response:--->", res);
    if (!res.ok) {
      const err = await res.text();
      console.error("[wallet/login] Backend error:", err);
      return NextResponse.json({ error: "Login failed" }, { status: res.status });
    }

    const data = await res.json();
    // Backend returns { data: { token, ... } }
    const token = data?.data?.token;
    if (!token) {
      return NextResponse.json({ error: "No token returned from backend" }, { status: 502 });
    }

    return NextResponse.json({ token, address: body.public_key });
  } catch (error) {
    console.error("[wallet/login] Network error:", error);
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 500 });
  }
}
