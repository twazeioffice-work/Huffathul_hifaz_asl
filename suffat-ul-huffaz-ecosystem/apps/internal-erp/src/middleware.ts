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
  // TEMPORARILY DISABLED: Custom domain rewriting was blocking tunnel access.
  // Re-enable when deploying to production with real custom domains (e.g. portal.myschool.edu).
  // Original logic preserved in git history (commit before this change).
  return NextResponse.next();
}
