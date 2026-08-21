// Location: apps/internal-erp/src/app/app/[institutionCode]/[branchCode]/erp/community/competitions/page.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    institutionCode: string;
    branchCode: string;
  }>;
}

export default async function CompetitionsPage(props: any) {
  const params = await props.params;
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Competitions & Events</h1>
        <p className="text-xs text-muted-foreground">Schedule and manage upcoming academic competitions.</p>
      </div>

      <div className="glass-panel p-6 rounded-lg text-center text-muted-foreground text-sm">
        <p>No active competitions scheduled for this term.</p>
      </div>
    </div>
  );
}
