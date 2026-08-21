import { NextRequest, NextResponse } from "next/server";
import { redis, publicFormLimiter, CACHE_TTL_TENANT } from "./lib/upstash";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
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

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const hostname = rawHost.split(":")[0].toLowerCase();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.ip || "127.0.0.1";

  // 1. PUBLIC GATEWAY SECURITY: Sliding-Window Rate Limiting on Ingestion Routes
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

  // 2. DIRECT-HOST PASSTHROUGH (GCP VM, Cloudflare Tunnel, Staging, Localhost)
  const isDirectHost =
    IPV4_REGEX.test(rawHost) ||
    DEV_DOMAINS.some((domain) => hostname.endsWith(domain)) ||
    hostname === "";

  if (isDirectHost) {
    const response = NextResponse.next();
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    await handleTokenRotation(request, response);
    return response;
  }

  // Ignore static files and API routes for tenant domain rewrites
  if (url.pathname.startsWith("/api/") || url.pathname.includes(".")) {
    const response = NextResponse.next();
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    await handleTokenRotation(request, response);
    return response;
  }

  // 3. MULTI-TENANCY CACHED LOOKUP ENGINE
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
      await handleTokenRotation(request, response);
      return response;
    }

    // Default fallback directory rewrite
    const response = NextResponse.rewrite(new URL(`/app/${hostname}${url.pathname}`, request.url));
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    await handleTokenRotation(request, response);
    return response;
  } catch (error) {
    console.error("Middleware multi-tenant routing error:", error);
    const response = NextResponse.next();
    response.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    await handleTokenRotation(request, response);
    return response;
  }
}

// 4. EDGE MIDDLEWARE: TOKEN ROTATION & DUAL-HEADER INJECTION
function parseJwtExp(token: string): number | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.exp || null;
  } catch (e) {
    return null;
  }
}

async function handleTokenRotation(request: NextRequest, response: NextResponse) {
  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (token && refreshToken) {
    const exp = parseJwtExp(token);
    const now = Math.floor(Date.now() / 1000);

    // If expiring within 60 seconds
    if (exp && (exp - now) < 60) {
      try {
        // Proxy to FastAPI backend to rotate token
        const backendUrl = process.env.INTERNAL_API_URL || 'http://localhost:8000';
        const refreshRes = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `refresh_token=${refreshToken}`
          }
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          const newAccessToken = data.access_token;
          const newRefreshToken = data.refresh_token;

          // Dual-Header Injection
          // 1. Update browser cookies via Set-Cookie
          response.cookies.set('access_token', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/'
          });
          if (newRefreshToken) {
            response.cookies.set('refresh_token', newRefreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/'
            });
          }

          // 2. Overwrite Authorization header for upstream backend requests
          response.headers.set('Authorization', `Bearer ${newAccessToken}`);
          request.headers.set('Authorization', `Bearer ${newAccessToken}`);
        }
      } catch (err) {
        console.error("Edge token rotation failed:", err);
      }
    } else if (token) {
      // Inject Authorization header if valid
      response.headers.set('Authorization', `Bearer ${token}`);
      request.headers.set('Authorization', `Bearer ${token}`);
    }
  }
}
