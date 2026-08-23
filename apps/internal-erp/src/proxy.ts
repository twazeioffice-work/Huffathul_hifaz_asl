import { NextRequest, NextResponse } from "next/server";
import { redis, publicFormLimiter, CACHE_TTL_TENANT } from "./lib/upstash";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

const IPV4_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?$/;
const DEV_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "suffat.org",
  "loca.lt",
  "pinggy.link",
  "pinggy.net",
  "trycloudflare.com",
  "serveousercontent.com",
  "vercel.app",
  "railway.app",
];

const INITIAL_BUDGET_MS = "6000";

// Simple, edge-compatible JWT helper to decode claims without Node.js dependencies
function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // Replace URL-safe characters and decode base64
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const hostname = rawHost.split(":")[0].toLowerCase();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1";
  const { pathname } = request.nextUrl;

  // ==============================================================================
  // STEP 3: EDGE ROUTE-GATING & ZERO-TRUST AUTHENTICATION
  // ==============================================================================
  
  const isAuthOrAsset = pathname.startsWith("/_next") || 
                        pathname.startsWith("/api/v1/auth") ||
                        pathname.includes(".");
                        
  if (!isAuthOrAsset && (pathname.startsWith("/app") || pathname === "/login")) {
    const tokenCookie = request.cookies.get("access_token");
    
    if (!tokenCookie && pathname !== "/login") {
      // Session missing: Redirect unauthenticated user back to unified login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (tokenCookie) {
      const token = tokenCookie.value;
      const claims = decodeJwtPayload(token);

      // If token is invalid or parsing fails, purge and redirect to login
      if (!claims) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        return response;
      }

      // Guard Against URL Path-Tampering (Multi-Tenant Isolation)
      const appRouteRegex = /^\/app\/([^/]+)\/([^/]+)\/erp/;
      const match = pathname.match(appRouteRegex);

      if (match) {
        const urlTenant = match[1];
        const urlBranch = match[2];

        const userRole = claims.role;
        const userTenant = claims.institution_code || claims.tenant_id;
        const userBranch = claims.branch_code || claims.branch_id;

        // Rule A: Super Admin bypasses all path restrictions
        const globalRoles = ["SUPER_ADMIN", "System Owner", "HQ Management (Junction)", "GLOBAL_ACCOUNTANT"];
        if (!globalRoles.includes(userRole)) {
          // Rule B: Standard roles must strictly match their registered tenant ID
          if (urlTenant !== userTenant) {
            return NextResponse.redirect(new URL("/login", request.url));
          }

          // Rule C: Nazim and Ustad roles must strictly match their assigned branch ID
          if (urlBranch !== userBranch) {
            return NextResponse.redirect(new URL("/login", request.url));
          }
        }
      }

      // If an authenticated user tries to hit /login, fast-track them to their landing dashboard
      if (pathname === "/login") {
        let redirectUrl = "/app/suffat-hq/main/erp"; // Fallback HQ
        
        if (claims.role === "NAZIM" || claims.role === "CENTER_ADMIN" || claims.role === "Center Admin" || claims.role === "Manager") {
          redirectUrl = `/app/${claims.institution_code}/${claims.branch_code}/erp`;
        } else if (claims.role === "USTAD" || claims.role === "Usthad") {
          redirectUrl = `/app/${claims.institution_code}/${claims.branch_code}/erp/academics`;
        } else if (claims.role === "STUDENT" || claims.role === "Student") {
          redirectUrl = `/app/${claims.institution_code}/${claims.branch_code}/portal/student`;
        } else if (claims.role === "HQ Management (Junction)" || claims.role === "GLOBAL_ACCOUNTANT") {
          redirectUrl = `/app/suffat-hq/main/erp/finance`;
        }
        
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  // ==============================================================================
  // PUBLIC GATEWAY SECURITY: Sliding-Window Rate Limiting on Ingestion Routes
  // ==============================================================================
  if (
    url.pathname.startsWith("/api/public/") ||
    url.pathname.includes("/api/admission-ingest") ||
    url.pathname.includes("/api/lead-ingest")
  ) {
    try {
      const { success, limit, reset, remaining } = await publicFormLimiter.limit(ip);

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: "Too many attempts. Please wait before retrying.",
            reset_time: new Date(reset).toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
              "X-Timeout-Budget": INITIAL_BUDGET_MS,
            },
          }
        );
      }
    } catch (redisError) {
      // Fail-open strategy: If Upstash cluster is unreachable, do not block users
      console.error("Upstash Redis connection failed. Failing open:", redisError);
    }
  }

  // ==============================================================================
  // DIRECT-HOST PASSTHROUGH (GCP VM, Cloudflare Tunnel, Staging, Localhost)
  // ==============================================================================
  const isDirectHost =
    IPV4_REGEX.test(rawHost) ||
    DEV_DOMAINS.some((domain) => hostname.endsWith(domain)) ||
    hostname === "";

  if (isDirectHost) {
    const response = NextResponse.next();
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    return response;
  }

  // Ignore static files and API routes for tenant domain rewrites
  if (url.pathname.startsWith("/api/") || url.pathname.includes(".")) {
    const response = NextResponse.next();
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    return response;
  }

  // ==============================================================================
  // MULTI-TENANCY CACHED LOOKUP ENGINE
  // ==============================================================================
  try {
    const cacheKey = `tenant_domain:${hostname}`;

    // Attempt to pull resolved tenant domain context from Upstash cache
    let tenantData: string | null = await redis.get(cacheKey);

    if (!tenantData) {
      // Cache-Miss: Resolve hostname from backend API if configured
      if (process.env.INTERNAL_API_URL) {
        try {
          const resolveRes = await fetch(
            `${process.env.INTERNAL_API_URL}/api/v1/tenants/resolve?domain=${encodeURIComponent(hostname)}`,
            {
              headers: {
                "X-Server-Token": process.env.INTERNAL_SERVER_TOKEN || "",
              },
            }
          );

          if (resolveRes.ok) {
            const payload = await resolveRes.json();
            tenantData = JSON.stringify({
              institutionCode: payload.institution_code,
              branchCode: payload.branch_code,
            });

            // Write resolved mapping back to Upstash Redis with a 1-hour TTL
            await redis.set(cacheKey, tenantData, { ex: CACHE_TTL_TENANT });
          }
        } catch {
          // Backend offline - proceed to fallback directory rewrite
        }
      }
    }

    if (tenantData) {
      const parsed = typeof tenantData === "string" ? JSON.parse(tenantData) : tenantData;
      const institutionCode = parsed.institutionCode || hostname;
      const branchCode = parsed.branchCode || "main";

      const targetPath = `/app/${institutionCode}/${branchCode}${url.pathname}${url.search}`;
      const response = NextResponse.rewrite(new URL(targetPath, request.url));
      response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
      return response;
    }

    // Default fallback directory rewrite
    const response = NextResponse.rewrite(new URL(`/app/${hostname}${url.pathname}`, request.url));
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    return response;
  } catch (error) {
    console.error("Middleware multi-tenant routing error:", error);
    const response = NextResponse.next();
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    return response;
  }
}
