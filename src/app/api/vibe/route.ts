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
  const backendRes = await fetch("http://localhost:4040/api/create_app", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet: session.user.email,           // email passed as wallet (it's just a string ID)
      name: body.displayName,
      description: body.displayDescription,
      user_prompt,
      repo_url: "https://github.com/bethink/kalshi-template-ui",
      repo_branch: "main",
    }),
  });

  if (!backendRes.ok) {
    const err = await backendRes.json().catch(() => ({ error: "Backend error" }));
    return NextResponse.json({ error: err.error || "Failed to create project" }, { status: backendRes.status });
  }

  const result = await backendRes.json();
  console.log("[vibe] backend response →", JSON.stringify(result));

  return NextResponse.json({ success: true, data: result.data });
}
