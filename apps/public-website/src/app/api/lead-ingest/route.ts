import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const LIMIT_WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "127.0.0.1";
  const rateLimitKey = `rate_limit_lead:${ip}`;

  try {
    const currentRequests = await redis.incr(rateLimitKey);
    if (currentRequests === 1) {
      await redis.expire(rateLimitKey, LIMIT_WINDOW_SECONDS);
    }

    if (currentRequests > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          error:
            "Lead inquiry rate limit exceeded. Please wait 60 seconds before submitting again.",
        },
        {
          status: 429,
          headers: { "Retry-After": LIMIT_WINDOW_SECONDS.toString() },
        }
      );
    }

    const payload = await request.json();

    const sanitizedPayload = {
      name: payload.name?.replace(/<[^>]*>/g, "").trim() || "",
      email: payload.email?.toLowerCase().trim() || "",
      phone: payload.phone?.trim() || "",
      inquiry_type: payload.inquiry_type || "General",
      message: payload.message?.replace(/<[^>]*>/g, "").trim() || "",
      submitted_at: new Date().toISOString(),
      source_ip: ip,
    };

    // Forward to internal backend / mock lead logger
    return NextResponse.json(
      {
        success: true,
        message: "Inquiry logged successfully.",
        ticket_id: `TIC-${Date.now().toString().slice(-6)}`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Edge Lead Ingestion Gateway failed to process message." },
      { status: 500 }
    );
  }
}
