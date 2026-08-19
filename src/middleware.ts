import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

const IPV4_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?$/;
const DEV_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'suffat.org',
  'loca.lt',
  'pinggy.link',
  'pinggy.net',
  'trycloudflare.com',
  'serveousercontent.com',
  'vercel.app',
];

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const hostname = rawHost.split(':')[0].toLowerCase();

  const isDirectHost = 
    IPV4_REGEX.test(rawHost) || 
    DEV_DOMAINS.some((domain) => hostname.endsWith(domain)) ||
    hostname === '';

  if (isDirectHost) {
    return NextResponse.next();
  }

  // Multi-Tenant Custom Domain Routing
  return NextResponse.rewrite(new URL('/app/' + hostname + url.pathname, req.url));
}
