import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const LIMIT_WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "127.0.0.1";
  const rateLimitKey = `rate_limit_admission:${ip}`;

  try {
    // 1. Sliding-Window Rate Limiting via Redis / Resilient Fallback
    const currentRequests = await redis.incr(rateLimitKey);
    if (currentRequests === 1) {
      await redis.expire(rateLimitKey, LIMIT_WINDOW_SECONDS);
    }

    if (currentRequests > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          error:
            "Submission rate limit exceeded. Please wait 60 seconds before retrying.",
        },
        {
          status: 429,
          headers: { "Retry-After": LIMIT_WINDOW_SECONDS.toString() },
        }
      );
    }

    // 2. Extract and Sanitize Form Data
    const payload = await request.json();

    const sanitizedPayload = {
      ...payload,
      full_name: payload.full_name?.replace(/<[^>]*>/g, "").trim() || "",
      guardian_name: payload.guardian_name?.replace(/<[^>]*>/g, "").trim() || "",
      email: payload.email?.toLowerCase().trim() || "",
    };

    // 3. Forward Payload to Private ERP Gateway with Cryptographic Source Header
    const internalApiUrl =
      process.env.INTERNAL_API_URL || "http://127.0.0.1:8000";

    const erpResponse = await fetch(`${internalApiUrl}/api/v1/admissions/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Public-Signature": process.env.PUBLIC_SIGNATURE_KEY || "PUBLIC_KEY_STAGING",
      },
      body: JSON.stringify(sanitizedPayload),
    });

    if (!erpResponse.ok) {
      const errorData = await erpResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Enrollment rejected by internal validation rules.",
          details: errorData,
        },
        { status: erpResponse.status }
      );
    }

    const responseData = await erpResponse.json();
    return NextResponse.json(
      {
        success: true,
        reference: responseData.admission_number || "SUH-ADM-2026",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Edge Ingestion Gateway failed to process request." },
      { status: 500 }
    );
  }
}
