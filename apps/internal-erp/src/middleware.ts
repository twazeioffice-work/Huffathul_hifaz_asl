import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

const BACKEND_REFRESH_URL = "https://api.suffat.org/api/v1/auth/refresh";
// Mock PUBLIC_KEY for now
const PUBLIC_JWT_KEY = new TextEncoder().encode(process.env.JWT_PUBLIC_KEY || "mock-public-key-bytes");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/v1/auth') || pathname === '/login') {
    return NextResponse.next();
  }
  
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const { payload } = await jwtVerify(accessToken, PUBLIC_JWT_KEY);
    const exp = payload.exp as number;
    const now = Math.floor(Date.now() / 1000);
    
    if (exp - now < 60) {
      if (!refreshToken) {
        throw new Error("Missing structural credentials required for edge updates.");
      }
      
      const refreshResponse = await fetch(BACKEND_REFRESH_URL, {
        method: "POST",
        headers: {
          "Cookie": `refresh_token=${refreshToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!refreshResponse.ok) {
        throw new Error("Edge update failed.");
      }
      
      const payloadData = await refreshResponse.json();
      const nextAccessToken = payloadData.access_token;
      
      const response = NextResponse.next();
      
      response.cookies.set({
        name: 'access_token',
        value: nextAccessToken,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 900 
      });
      
      request.headers.set('Authorization', `Bearer ${nextAccessToken}`);
      
      return response;
    }
  } catch (error) {
    const failResponse = NextResponse.redirect(new URL('/login', request.url));
    failResponse.cookies.delete('access_token');
    failResponse.cookies.delete('refresh_token');
    return failResponse;
  }
  
  return NextResponse.next();
}
