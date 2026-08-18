import Link from "next/link";
import { CheckPermission } from "@/components/CheckPermission";
import { Plus, Search, Filter } from "lucide-react";

export default async function StaffDirectory({
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
          <h2 className="text-2xl font-bold tracking-tight">Staff Directory</h2>
          <p className="text-muted-foreground text-sm">
            Manage employees and department assignments.
          </p>
        </div>
        <CheckPermission 
          permission="staff.create" 
          institutionCode={institutionCode} 
          branchCode={branchCode}
        >
          <button
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </CheckPermission>
      </div>

      <div className="glass-panel rounded-lg p-4">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between pb-4">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search staff..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground pl-8"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="h-10 px-4 text-left font-medium">Employee ID</th>
                <th className="h-10 px-4 text-left font-medium">Name</th>
                <th className="h-10 px-4 text-left font-medium">Department</th>
                <th className="h-10 px-4 text-left font-medium">Role</th>
                <th className="h-10 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-mono">EMP-{3000 + i}</td>
                  <td className="p-4 align-middle font-medium">
                    Faculty Member {i}
                  </td>
                  <td className="p-4 align-middle">Academic</td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-accent/10 text-accent">
                      Teacher
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
      </div>
    </div>
  );
}
