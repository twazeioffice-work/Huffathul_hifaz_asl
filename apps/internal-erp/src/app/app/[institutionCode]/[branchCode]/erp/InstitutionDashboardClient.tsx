"use client";
import { BarChart3, Users, BookOpen, Clock, Activity } from "lucide-react";
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@nextui-org/react";

export function InstitutionDashboardClient({
  institutionCode,
  branchCode,
}: {
  institutionCode: string;
  branchCode: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics Overview</h2>
        <p className="text-sm text-muted-foreground">High-density snapshot of live institution metrics.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        <Card className="bg-card/80 backdrop-blur-md border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Active Student Profiles</h3>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-0">
            <div className="text-3xl font-bold text-foreground">1,245</div>
            <p className="text-xs text-emerald-500 mt-1">+12% from last month</p>
          </CardBody>
        </Card>

        <Card className="bg-card/80 backdrop-blur-md border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Batches & Progress</h3>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-0">
            <div className="text-3xl font-bold text-foreground">24</div>
            <p className="text-xs text-emerald-500 mt-1">82% Academic Year Completion</p>
          </CardBody>
        </Card>

        <Card className="bg-card/80 backdrop-blur-md border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Active Staff Count</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-400"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-0">
            <div className="text-3xl font-bold text-foreground">142</div>
            <p className="text-xs text-muted-foreground mt-1">Across 3 departments</p>
          </CardBody>
        </Card>

        <Card className="bg-card/80 backdrop-blur-md border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Local Sync Queue</h3>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-0">
            <div className="text-3xl font-bold text-foreground">0</div>
            <p className="text-xs text-emerald-500 mt-1">Fully Synced to Edge</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 bg-card/80 backdrop-blur-md border border-border shadow-sm">
          <CardHeader className="px-6 pt-6 pb-2">
            <h3 className="text-lg font-medium text-foreground">Recent Operations Log</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-2">
            <Table 
              aria-label="Recent Operations Log"
              removeWrapper 
              classNames={{
                th: "bg-muted text-muted-foreground font-semibold border-b border-border",
                td: "border-b border-border/50 py-3",
              }}
            >
              <TableHeader>
                <TableColumn>TIMESTAMP</TableColumn>
                <TableColumn>USER</TableColumn>
                <TableColumn>MODULE</TableColumn>
                <TableColumn>ACTION</TableColumn>
                <TableColumn>STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                {[
                  { id: 1, time: "2026-08-18 10:20:00", user: "admin@suh01.edu", module: "Admissions", action: "Enrolled STU-1002", status: "success" },
                  { id: 2, time: "2026-08-18 10:15:22", user: "ustadh.ahmed@suh01.edu", module: "Academics", action: "Updated Hifz Targets", status: "success" },
                  { id: 3, time: "2026-08-18 09:45:11", user: "system_worker", module: "Sync", action: "Pulled 42 Offline Mutations", status: "warning" },
                  { id: 4, time: "2026-08-18 09:30:05", user: "admin@suh01.edu", module: "RBAC", action: "Revoked Access for User 402", status: "danger" },
                ].map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs text-muted-foreground">{row.time}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{row.user}</TableCell>
                    <TableCell className="text-sm text-foreground">{row.module}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.action}</TableCell>
                    <TableCell>
                      <Chip 
                        size="sm" 
                        color={row.status === "success" ? "success" : row.status === "warning" ? "warning" : "danger"} 
                        variant="flat"
                      >
                        {row.status.toUpperCase()}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
