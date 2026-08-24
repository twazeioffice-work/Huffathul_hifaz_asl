import React from "react";
import { cookies } from 'next/headers';
import * as jose from 'jose';
import CenterAdminDashboard from "./CenterAdminDashboard";
import NazimDashboard from "./NazimDashboard";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

export default async function ERPDashboardPage({ params }: { params: Promise<{ institutionCode: string; branchCode: string; }> }) {
  const { institutionCode, branchCode } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  let role = 'STUDENT';
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      role = (payload.role as string) || 'STUDENT';
    } catch (e) {}
  }

  if (role === 'NAZIM') {
    return <NazimDashboard branchCode={branchCode} institutionCode={institutionCode} />;
  }
  
  // Default fallback for Center Admin, Super Admin, etc (Super Admin uses a different path but just in case)
  return <CenterAdminDashboard branchCode={branchCode} institutionCode={institutionCode} />;
}
