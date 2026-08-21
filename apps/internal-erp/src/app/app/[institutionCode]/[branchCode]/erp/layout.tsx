import { ReactNode } from "react";
import { TopNavigationBar } from "@/components/navigation/TopNavigationBar";
import { MobileBottomBar } from "@/components/navigation/MobileBottomBar";

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
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background text-foreground flex-col">
      {/* Top Navigation (Links hidden on Mobile, Logo & Profile visible) */}
      <TopNavigationBar 
        institutionCode={institutionCode}
        branchCode={branchCode}
        currentTenantName={branchCode.toUpperCase()}
        userRole="SUPER_ADMIN" // TODO: Dynamically inject from session
        userName="Admin"
        userEmail="admin@suffat.com"
      />

      {/* Main Content Area (Scrollable) */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-card/10 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <MobileBottomBar 
        institutionCode={institutionCode}
        branchCode={branchCode}
      />
    </div>
  );
}
