import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Nuclear option executed. All sessions revoked." });
  
  // Clear access_token cookie
  response.cookies.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });

  // Clear demo auth role cookie if it exists
  response.cookies.set('demo_auth_role', '', {
    path: '/',
    expires: new Date(0)
  });
  
  // Clear host secure token
  response.cookies.set('__Host-Secure-Token', '', {
    secure: true,
    path: '/',
    expires: new Date(0)
  });

  return response;
}
