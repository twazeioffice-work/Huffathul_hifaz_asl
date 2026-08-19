/**
 * Suffat-ul Huffaz — Edge Middleware
 * ===================================
 * Layers:
 *   1. Dynamic Timeout Budget Header Injection (`X-Timeout-Budget: 6000`)
 *   2. Rate limiting on intake/mutation endpoints (Upstash sliding window)
 *   3. Direct-host passthrough (GCP VM, Cloudflare Tunnel, localhost)
 *   4. Tenant subdomain routing via Upstash cache or DB fallback
 *
 * Graceful degradation: if Upstash is unreachable, all requests pass through.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

// ── Host Detection ──────────────────────────────────────────────────────────

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

// Initial timeout budget for Next.js BFF request lifecycle
const INITIAL_BUDGET_MS = "6000";

// ── Rate Limiting (lazy-loaded to avoid import errors when deps missing) ────

async function checkRateLimit(ip: string, pathname: string): Promise<NextResponse | null> {
  try {
    const { getRateLimiter } = await import("@/lib/upstash");
    const limiter = getRateLimiter();
    const { success, reset } = await limiter.limit(ip);

    if (!success) {
      // Optionally capture in Sentry (if SDK is loaded)
      try {
        const Sentry = await import("@sentry/nextjs");
        Sentry.captureMessage(
          `Rate limit breached by IP: ${ip} on route: ${pathname}`,
          "warning"
        );
      } catch {
        // Sentry not installed yet — skip silently
      }

      return new NextResponse(
        JSON.stringify({
          error: "Too many registration attempts. Please try again shortly.",
          retry_after: reset,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            "X-Timeout-Budget": INITIAL_BUDGET_MS,
          },
        }
      );
    }
  } catch {
    // Upstash unreachable — graceful fallback, allow request through
  }
  return null;
}

// ── Tenant Cache Lookup ─────────────────────────────────────────────────────

async function lookupTenantFromCache(hostname: string): Promise<string | null> {
  try {
    const { getCachedTenantId } = await import("@/lib/upstash");
    return await getCachedTenantId(hostname);
  } catch {
    return null;
  }
}

// ── Main Middleware ──────────────────────────────────────────────────────────

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "127.0.0.1";
  const rawHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const hostname = rawHost.split(":")[0].toLowerCase();

  // ─── Layer 1: Rate Limiting on Intake Endpoints ───────────────────────
  if (
    url.pathname.includes("/api/admission-ingest") ||
    url.pathname.includes("/api/lead-ingest")
  ) {
    const blocked = await checkRateLimit(ip, url.pathname);
    if (blocked) return blocked;
  }

  // ─── Layer 2: Direct-Host Passthrough (GCP / Tunnel / Dev) ────────────
  const isDirectHost =
    IPV4_REGEX.test(rawHost) ||
    DEV_DOMAINS.some((domain) => hostname.endsWith(domain)) ||
    hostname === "";

  if (isDirectHost) {
    const res = NextResponse.next();
    res.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
    return res;
  }

  // ─── Layer 3: Tenant Subdomain Routing (Upstash Cache → DB Fallback) ──
  const isStaticAsset =
    url.pathname.match(/\.(svg|png|jpg|jpeg|css|js|ico|woff2?)$/) !== null;

  if (!isStaticAsset) {
    const tenantId = await lookupTenantFromCache(hostname);
    if (tenantId) {
      const res = NextResponse.rewrite(
        new URL("/app/" + tenantId + url.pathname, req.url)
      );
      res.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
      return res;
    }
  }

  // ─── Layer 4: Custom Domain Fallback (directory-based routing) ────────
  const res = NextResponse.rewrite(
    new URL("/app/" + hostname + url.pathname, req.url)
  );
  res.headers.set("X-Timeout-Budget", INITIAL_BUDGET_MS);
  return res;
}
