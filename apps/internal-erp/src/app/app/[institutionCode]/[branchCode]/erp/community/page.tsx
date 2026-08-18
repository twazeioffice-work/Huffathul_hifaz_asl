// Location: apps/internal-erp/src/app/app/[institutionCode]/[branchCode]/erp/community/page.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

interface PageProps {
  params: {
    institutionCode: string;
    branchCode: string;
  };
}

export default async function AlumniDirectoryPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Alumni Directory</h1>
        <p className="text-xs text-muted-foreground">Search and connect with alumni.</p>
      </div>

      <div className="glass-panel p-6 rounded-lg text-center text-muted-foreground text-sm">
        <p>Alumni directory integration pending module sync...</p>
      </div>
    </div>
  );
}
