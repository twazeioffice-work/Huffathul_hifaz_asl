import { ReactNode } from 'react';
import { getSessionClaims } from '@/lib/session';

interface SecurityGuardProps {
  permission: string;
  institutionCode: string;
  branchCode: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export async function CheckPermission({ 
  permission, 
  institutionCode, 
  branchCode, 
  children, 
  fallback = null 
}: SecurityGuardProps) {
  const claims = await getSessionClaims();
  if (!claims) return <>{fallback}</>;
  
  const tenantContext = claims.tenants.find(
    (t: any) => t.inst_code.toLowerCase() === institutionCode.toLowerCase() &&
                t.br_code.toLowerCase() === branchCode.toLowerCase()
  );
  
  if (!tenantContext) return <>{fallback}</>;
  
  const hasAccess = tenantContext.permissions.includes(permission);
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
