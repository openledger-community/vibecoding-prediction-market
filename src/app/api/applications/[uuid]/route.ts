import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request, context: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await context.params;
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const backendApiUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:4040";

    try {
        const backendRes = await fetch(`${backendApiUrl}/api/applications/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Pass the user's email as the wallet address header
                "x-wallet-address": session.user.email,
                "x-auth-token": (session as any).accessToken || "",
            },
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
