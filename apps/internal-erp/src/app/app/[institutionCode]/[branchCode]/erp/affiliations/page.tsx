// Location: apps/internal-erp/src/app/app/[institutionCode]/[branchCode]/erp/affiliations/page.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CheckPermission from "@/components/CheckPermission";

interface PageProps {
  params: {
    institutionCode: string;
    branchCode: string;
  };
}

async function fetchActiveAffiliations(instCode: string, brCode: string) {
  // In a real scenario this fetches from Next.js backend API
  // Using a mock return to ensure valid build behavior for Phase 8.
  return {
    requests: [
      { id: "1", code: "AFF-01", name: "Darul Uloom Central", status: "APPROVED", updated_at: "2026-08-10T10:00:00Z" },
      { id: "2", code: "AFF-02", name: "Al Huda Academy", status: "PENDING", updated_at: "2026-08-15T12:00:00Z" }
    ]
  };
}

export default async function AffiliatedWorkflowDashboard({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await fetchActiveAffiliations(params.institutionCode, params.branchCode);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Affiliation & Outreach</h1>
          <p className="text-xs text-muted-foreground">Manage and verify outreach agreements across national networks.</p>
        </div>

        <CheckPermission requiredPermission="affiliation:request:create">
          <button className="bg-primary hover:bg-accent-hover text-background px-4 py-2 rounded text-xs font-bold transition-all shadow-glow">
            + Request New Affiliation
          </button>
        </CheckPermission>
      </div>

      <div className="glass-panel p-6 rounded-lg">
        <table className="w-full data-density-table border-collapse">
          <thead>
            <tr className="text-left border-b border-muted">
              <th className="py-2">Affiliation Code</th>
              <th className="py-2">Institution Name</th>
              <th className="py-2">Status</th>
              <th className="py-2">Verification Date</th>
            </tr>
          </thead>
          <tbody>
            {data.requests.map((req: any) => (
              <tr key={req.id} className="hover:bg-muted/30 transition-colors border-b border-muted/50">
                <td className="py-3 font-mono text-primary font-medium">{req.code}</td>
                <td className="py-3">{req.name}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold ${
                    req.status === 'APPROVED' ? 'bg-success/20 text-success' :
                    req.status === 'PENDING' ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">{new Date(req.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
