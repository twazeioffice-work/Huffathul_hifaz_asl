import { ReactNode } from 'react';

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

  return (
    <div data-institution={institutionCode} data-branch={branchCode}>
      {children}
    </div>
  );
}
