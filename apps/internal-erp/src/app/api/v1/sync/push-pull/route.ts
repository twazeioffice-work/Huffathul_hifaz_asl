import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Log the payload for demonstration/debugging purposes
    console.log("[Sync API] Received Offline-First Sync Payload:", JSON.stringify(payload, null, 2));

    // Simulate backend processing delay (e.g., merging deltas with PostgreSQL)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return a successful sync acknowledgment back to the PWA
    return NextResponse.json({
      status: "success",
      server_deltas: {
        sabaq: [],
        attendance: [],
        roster: [],
        deleted_ids: []
      },
      next_pull_token: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error("[Sync API] Error parsing sync payload:", error);
    return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
  }
}
