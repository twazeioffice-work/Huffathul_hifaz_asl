import Link from "next/link";
import { CheckPermission } from "@/components/CheckPermission";
import { Plus, Search, Filter } from "lucide-react";

export default async function StudentRoster({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = await params;
  const basePath = `/app/${institutionCode}/${branchCode}/erp`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Roster</h2>
          <p className="text-muted-foreground text-sm">
            Manage student records and admissions for {branchCode.toUpperCase()}.
          </p>
        </div>
        <CheckPermission 
          permission="admission.create" 
          institutionCode={institutionCode} 
          branchCode={branchCode}
        >
          <Link
            href={`${basePath}/students/enroll`}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2"
          >
            <Plus className="h-4 w-4" />
            Admissions Wizard
          </Link>
        </CheckPermission>
      </div>

      <div className="glass-panel rounded-lg p-4">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between pb-4">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            />
          </div>
          <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="h-10 px-4 text-left font-medium">Admission #</th>
                <th className="h-10 px-4 text-left font-medium">Name</th>
                <th className="h-10 px-4 text-left font-medium">Batch</th>
                <th className="h-10 px-4 text-left font-medium">Status</th>
                <th className="h-10 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-mono">ADM-{1000 + i}</td>
                  <td className="p-4 align-middle font-medium">
                    <Link href={`${basePath}/students/${1000+i}`} className="hover:underline hover:text-primary">
                      Student Name {i}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">Batch 2026</td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-success/10 text-success">
                      Active
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button className="text-muted-foreground hover:text-primary">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing 1-5 of 1,245
          </div>
          <div className="flex items-center gap-2">
            <button disabled className="h-8 rounded-md border px-3 text-sm disabled:opacity-50">Previous</button>
            <button className="h-8 rounded-md border px-3 text-sm hover:bg-muted">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
