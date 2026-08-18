import { CheckPermission } from "@/components/CheckPermission";
import { Plus, LayoutGrid, Network } from "lucide-react";

export default async function AcademicDashboard({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = await params;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Academic Management</h2>
          <p className="text-muted-foreground text-sm">
            Configure curriculum trees, batches, and course structures.
          </p>
        </div>
        <CheckPermission 
          permission="academic.create" 
          institutionCode={institutionCode} 
          branchCode={branchCode}
        >
          <button
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            New Course
          </button>
        </CheckPermission>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Course Tree */}
        <div className="col-span-1 glass-panel rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Network className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm tracking-wide">Curriculum Tree</h3>
          </div>
          <div className="space-y-2">
            {["Quranic Studies", "Islamic Jurisprudence", "Arabic Language"].map((course, idx) => (
              <div key={idx} className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="font-medium text-sm">{course}</div>
                <div className="text-xs text-muted-foreground mt-1">3 Subjects • 12 Modules</div>
              </div>
            ))}
          </div>
        </div>

        {/* Batch Scheduling */}
        <div className="col-span-2 glass-panel rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-sm tracking-wide">Active Batches</h3>
            </div>
            <button className="text-xs text-primary hover:underline font-medium">View All</button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {[2024, 2025, 2026, 2027].map((year) => (
              <div key={year} className="rounded-md border bg-card/40 p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <h4 className="font-medium">Batch {year}</h4>
                <p className="text-xs text-muted-foreground mt-2">Active Students: 120</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Semester 1</span>
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-success/10 text-success">
                    In Progress
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
