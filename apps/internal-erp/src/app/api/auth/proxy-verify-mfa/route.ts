import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const backendRes = await fetch("http://localhost:8000/api/v1/auth/verify-mfa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json({ error: data.detail || "MFA Verification Failed" }, { status: backendRes.status });
    }

    const response = NextResponse.json({ success: true, ...data });

    // Extract the Set-Cookie headers from the FastAPI backend and proxy them to the browser
    const setCookieHeader = backendRes.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("Set-Cookie", setCookieHeader);
    }
    
    // We also store the access token in an HttpOnly cookie so the Next.js Server Components can read it
    response.cookies.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error. Core Vault Unreachable." }, { status: 500 });
  }
}
