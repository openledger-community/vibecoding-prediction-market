import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/serverAuth";

export async function GET(
  request: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params;
  const { wallet, token, authenticated } = await getServerAuth(request);
  if (!authenticated || !wallet) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const backendApiUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:4040";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-wallet-address": wallet,
    };
    if (token) {
      headers["Authorization"] = token;
    }

    const backendRes = await fetch(`${backendApiUrl}/api/applications/${uuid}`, {
      method: "GET",
      headers,
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error(`[applications] Backend fetch failed for ${uuid}: ${backendRes.status}`, errorText);
      return NextResponse.json({ error: "Failed to fetch application" }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[applications] Network error fetching ${uuid}:`, error);
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
