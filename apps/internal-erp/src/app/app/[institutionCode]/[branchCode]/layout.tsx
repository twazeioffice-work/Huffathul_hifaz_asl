import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import AppShell from '@/components/layout/AppShell';
import { Role } from '@/lib/navigation';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "supersecretkey");

interface TenantLayoutProps {
  children: ReactNode;
  params: Promise<{
    institutionCode: string;
    branchCode: string;
  }>;
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { institutionCode, branchCode } = await params;

  if (!institutionCode || !branchCode) {
    return <div>Invalid Tenant Configuration</div>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let role: Role = 'STUDENT'; // default fallback
  
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      role = (payload.role as Role) || 'STUDENT';
    } catch (e) {
      // Invalid token, it will be handled by middleware mostly.
    }
  }

  return (
    <AppShell role={role} institutionCode={institutionCode} branchCode={branchCode}>
      {children}
    </AppShell>
  );
}
