"use client";

import { useState } from "react";
import { FileText, Sheet, BarChart3, Clock, Activity } from "lucide-react";
import SVGAnalyticsChart from "@/components/erp/SVGAnalyticsChart";
import ExportProgressToast from "@/components/erp/ExportProgressToast";

const mockPerformanceData = [
  { label: "W1", value: 72 },
  { label: "W2", value: 80 },
  { label: "W3", value: 75 },
  { label: "W4", value: 88 },
  { label: "W5", value: 92 },
  { label: "W6", value: 85 },
  { label: "W7", value: 95 },
  { label: "W8", value: 90 },
];

const mockAttendanceData = [
  { label: "Mon", value: 95 },
  { label: "Tue", value: 92 },
  { label: "Wed", value: 88 },
  { label: "Thu", value: 96 },
  { label: "Fri", value: 80 },
];

const recentExports = [
  { id: "1", type: "Student Progress PDF", date: "Aug 15, 2026", status: "completed" },
  { id: "2", type: "Financial Ledger XLSX", date: "Aug 14, 2026", status: "completed" },
  { id: "3", type: "Attendance Summary PDF", date: "Aug 12, 2026", status: "completed" },
];

export default function ReportsDashboardPage() {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleExport = (type: "pdf" | "excel") => {
    const taskId = `task-${Date.now()}`;
    setActiveTaskId(taskId);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            REPORTING &amp; ANALYTICS CENTER
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate exports, view dashboards, and access the immutable audit trail.
          </p>
        </div>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport("pdf")}
          className="glass-panel border border-border rounded-lg p-5 text-left hover:border-primary/40 transition-colors group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                Student Progress PDF
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Hifz memorization &amp; attendance report
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleExport("excel")}
          className="glass-panel border border-border rounded-lg p-5 text-left hover:border-primary/40 transition-colors group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Sheet className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                Financial Ledger XLSX
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Double-entry general ledger export
              </p>
            </div>
          </div>
        </button>

        <a
          href="audit-logs"
          className="glass-panel border border-border rounded-lg p-5 text-left hover:border-primary/40 transition-colors group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                Audit Trail
              </h3>
              <p className="text-[10px] text-muted-foreground">
                View immutable system activity logs
              </p>
            </div>
          </div>
        </a>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SVGAnalyticsChart
          data={mockPerformanceData}
          title="HIFZ PERFORMANCE TREND"
          badge="8 WEEKS"
          lineColor="#00F0FF"
        />
        <SVGAnalyticsChart
          data={mockAttendanceData}
          title="WEEKLY ATTENDANCE"
          badge="THIS WEEK"
          lineColor="#0D9488"
        />
      </div>

      {/* Recent Exports Table */}
      <div className="glass-panel rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-primary">RECENT EXPORT HISTORY</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-card/60">
                <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Type</th>
                <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Generated</th>
                <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Status</th>
                <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentExports.map((exp) => (
                <tr key={exp.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-2.5 text-white font-medium">{exp.type}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {exp.date}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-green-400 font-bold text-[10px]">● COMPLETED</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="text-primary hover:underline text-[10px] font-bold">
                      RE-DOWNLOAD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Progress Toast */}
      <ExportProgressToast taskId={activeTaskId} />
    </div>
  );
}
