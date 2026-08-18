// Location: apps/internal-erp/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // 1. Skip system base domains, static assets, and authentication endpoints
  if (
    hostname.includes("suffat.org") || 
    hostname.includes("localhost") || 
    url.pathname.startsWith("/_next") || 
    url.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 2. Fetch mapping from Redis cache (Custom Domain -> Institution/Branch Code)
  let tenantMapping = null;
  try {
    const res = await fetch(`https://api.suffat.org/api/v1/branding/resolve-domain?domain=${hostname}`, {
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      tenantMapping = await res.json(); // e.g. { institutionCode: "suh01", branchCode: "mn01" }
    }
  } catch (error) {
    console.error("Custom domain mapping lookup failed", error);
  }

  if (!tenantMapping) {
    // Bounce client to system default fallback if domain is unmapped
    return NextResponse.redirect(new URL("https://suffat.org/unmapped-domain", request.url));
  }

  const { institutionCode, branchCode } = tenantMapping;

  // 3. Dynamic rewrite: map incoming request path internally to path-based tenant router
  // e.g. 'custom-domain.org/erp/dashboard' -> '/app/suh01/mn01/erp/dashboard'
  const rewrittenUrl = new URL(
    `/app/${institutionCode}/${branchCode}${url.pathname}${url.search}`,
    request.url
  );

  return NextResponse.rewrite(rewrittenUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
