import { ReactNode } from "react";
import { cookies } from "next/headers";
import { TopNavigationBar } from "@/components/navigation/TopNavigationBar";
import { MobileBottomBar } from "@/components/navigation/MobileBottomBar";
import { DemoRoleSwitcher } from "@/components/navigation/DemoRoleSwitcher";
import { LeftSidebar } from "@/components/navigation/LeftSidebar";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    institutionCode: string;
    branchCode: string;
  }>;
}

export default async function ERPWorkspaceLayout({ children, params }: LayoutProps) {
  const { institutionCode, branchCode } = await params;
  const cookieStore = await cookies();
  const userRole = (cookieStore.get("demo_auth_role")?.value || "SUPER_ADMIN") as "SUPER_ADMIN" | "NAZIM" | "USTAD";

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background text-foreground flex-col">
      {/* Top Navigation (Links hidden on Mobile, Logo & Profile visible) */}
      {userRole !== "USTAD" && (
        <TopNavigationBar 
          institutionCode={institutionCode}
          branchCode={branchCode}
          currentTenantName={branchCode.toUpperCase()}
          userRole={userRole}
          userName={userRole === "SUPER_ADMIN" ? "Admin" : "Ustad Bilal"}
          userEmail={userRole === "SUPER_ADMIN" ? "admin@suffat.com" : "bilal@suffat.com"}
        />
      )}


      {/* Main Content Area with Left Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar 
          institutionCode={institutionCode} 
          branchCode={branchCode} 
          userRole={userRole} 
        />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-card/10 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <MobileBottomBar 
        institutionCode={institutionCode}
        branchCode={branchCode}
      />

      <DemoRoleSwitcher currentRole={userRole} />
    </div>
  );
}
