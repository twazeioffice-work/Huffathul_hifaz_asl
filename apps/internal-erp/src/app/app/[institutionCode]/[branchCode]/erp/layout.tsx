import { ReactNode } from "react";
import { TenancyHeader } from "@/components/erp/TenancyHeader";
import { SidebarNavigation } from "@/components/erp/SidebarNavigation";
import { SyncStatusWidget } from "@/components/erp/SyncStatusWidget";

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
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* 1. Static Left Navigation Rail (Server-Generated) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <span className="text-lg font-bold tracking-wider text-primary">SUFFAT ERP</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <SidebarNavigation 
            institutionCode={institutionCode} 
            branchCode={branchCode} 
          />
        </nav>
        {/* 2. Interactivity Leaf: Sync and Connectivity Status (Client Component) */}
        <div className="p-4 border-t border-border">
          <SyncStatusWidget />
        </div>
      </aside>

      {/* 3. Core Content Canvas */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar Context Panel (Server Component) */}
        <header className="flex h-16 items-center justify-between px-8 border-b border-border bg-card/30">
          <TenancyHeader 
            institutionCode={institutionCode} 
            branchCode={branchCode} 
          />
        </header>
        
        {/* Page Body Viewport */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-background to-card/10">
          {children}
        </main>
      </div>
    </div>
  );
}
