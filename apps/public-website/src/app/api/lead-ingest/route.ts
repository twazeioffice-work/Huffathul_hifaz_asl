import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Sliding Window Rate-Limiter (Mocked for Edge)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (payload.spamFlag === true) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }

    // 2. Forward to Private FastAPI Backend Gateway
    console.log(`[Public Edge Proxy] Forwarding Lead from ${ip} to Core Backend...`);
    
    // In production, this proxies to http://core-backend:8000/api/v1/leads
    const backendResponse = { status: "SUCCESS", lead_id: "LD-99231", tenant: "suh-01" };

    return NextResponse.json(backendResponse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload formatting." }, { status: 400 });
  }
}
