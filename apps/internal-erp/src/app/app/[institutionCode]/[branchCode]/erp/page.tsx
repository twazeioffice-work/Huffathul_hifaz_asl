import { BarChart3, Users, BookOpen, Clock } from "lucide-react";

export default async function InstitutionDashboard({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = await params;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        <div className="glass-panel rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Students</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
        </div>

        <div className="glass-panel rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Active Staff</h3>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">142</div>
          <p className="text-xs text-muted-foreground mt-1">+2 new hires</p>
        </div>

        <div className="glass-panel rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Active Courses</h3>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground mt-1">Across 3 departments</p>
        </div>

        <div className="glass-panel rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Sync Status</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">Optimal</div>
          <p className="text-xs text-muted-foreground mt-1">WatermelonDB synced</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="glass-panel rounded-xl col-span-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Enrollment Activity</h3>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-[250px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
            [Chart Canvas Placeholder]
          </div>
        </div>
        <div className="glass-panel rounded-xl col-span-3 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Operations</h3>
          </div>
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary">Log</span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Admission #{1000 + i}</p>
                  <p className="text-xs text-muted-foreground">Synced successfully.</p>
                </div>
                <div className="text-xs text-muted-foreground">2m ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
