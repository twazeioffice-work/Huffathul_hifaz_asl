import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. portal.myschool.edu or erp.suffat.org)
  const hostname = req.headers.get('host') || 'erp.suffat.org';

  // If standard system domain, route normally
  if (hostname.includes('suffat.org') || hostname.includes('localhost')) {
    return NextResponse.next();
  }

  // Rewrite to dynamic path for custom domains
  // Allows Next.js to map `portal.myschool.edu` to `app/app/[customDomain]/...` under the hood
  return NextResponse.rewrite(new URL(`/app/${hostname}${url.pathname}`, req.url));
}
