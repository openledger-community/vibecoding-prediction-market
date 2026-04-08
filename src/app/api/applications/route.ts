import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch all apps for this user from the backend
  const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:4040";

  try {
    console.log("session.user.email", session.user.email);
    const backendRes = await fetch(`${backendApiUrl}/api/applications?wallet=${encodeURIComponent(session.user.email)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log("session.user.email", session.user.email);


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
