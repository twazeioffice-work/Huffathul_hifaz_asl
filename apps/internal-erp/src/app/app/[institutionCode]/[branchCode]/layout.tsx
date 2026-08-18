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
    <div className="tenant-wrapper" data-institution={institutionCode} data-branch={branchCode}>
      <header className="tenant-header">
        <h1>{institutionCode.toUpperCase()} - {branchCode.toUpperCase()}</h1>
      </header>
      <main className="tenant-main">
        {children}
      </main>
    </div>
  );
}
