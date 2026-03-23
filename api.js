// Test /api/search (LLM path)
fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Bitcoin price prediction" })
}).then(r => r.json()).then(console.log)

// Test /api/search (manual picker path — no LLM)
fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: "Politics", tags: ["Trump"] })
}).then(r => r.json()).then(console.log)

// Test /api/vibe
fetch("/api/vibe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        category_tags: { "Politics": "Trump,International" },
        displayName: "Test",
        displayDescription: "test desc",
        designPattern: "dashboard"
    })
}).then(r => r.json()).then(console.log)

curl - s - X POST http://localhost:3000/api/search \
-H "Content-Type: application/json" \
-b "authjs.session-token=PASTE_COOKIE_HERE" \
-d '{"prompt":"Will it snow in Chicago?"}'