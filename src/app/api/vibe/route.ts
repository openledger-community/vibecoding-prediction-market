import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { VibePayload } from "@/lib/types";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Omit<VibePayload, "email">;
  try {
    body = (await request.json()) as Omit<VibePayload, "email">;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate required fields
  if (!body.category_tags || !body.displayName || !body.displayDescription || !body.designPattern) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Extract category and tags from category_tags e.g. { "Politics": "Trump,International" }
  const category = Object.keys(body.category_tags)[0];
  const tags = body.category_tags[category] || "";

  // Find the design pattern label for the prompt
  const { DESIGN_PATTERNS } = await import("@/lib/types");
  const pattern = DESIGN_PATTERNS.find((p) => p.id === body.designPattern);
  const patternLabel = pattern ? `${pattern.name} — ${pattern.description}` : body.designPattern;

  // Build the user_prompt that V0 will use to generate/customize the UI
  const user_prompt = [
    `Build a prediction market UI called "${body.displayName}".`,
    `Description: ${body.displayDescription}`,
    `Category: ${category} | Tags: ${tags}`,
    `Design style: ${patternLabel}`,
    `This is a Kalshi prediction market dashboard. Display open markets for the selected category and tags.`,
  ].join("\n");

  // POST to open_terminal_backend → triggers createProject + initChat + saves to DB
  const backendApiUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:4040";
  console.log("Syncing with backend at:", backendApiUrl);

  try {
    const backendRes = await fetch(`${backendApiUrl}/api/create_app`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: session.user.email,
        name: body.displayName,
        description: body.displayDescription,
        user_prompt,
      }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error(`[vibe] Backend sync failed: ${backendRes.status} ${backendRes.statusText}`, errorText);
      return NextResponse.json({ error: "Failed to create project on backend" }, { status: backendRes.status });
    }

    const result = await backendRes.json();
    console.log("[vibe] Backend sync success:", result);

    return NextResponse.json({ success: true, data: result.data });

  } catch (backendError) {
    console.error("[vibe] Failed to connect to backend:", backendError);
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 500 });
  }
}
