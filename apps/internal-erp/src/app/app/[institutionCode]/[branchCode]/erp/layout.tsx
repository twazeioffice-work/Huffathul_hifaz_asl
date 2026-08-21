import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    institutionCode: string;
    branchCode: string;
  }>;
}

export default async function ERPWorkspaceLayout({ children, params }: LayoutProps) {
  const { institutionCode, branchCode } = await params;

  return (
    <div className="flex min-h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Full-Width Content Canvas — Top Nav is embedded in each page */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-card/10">
          {children}
        </main>
      </div>
    </div>
  );
}
