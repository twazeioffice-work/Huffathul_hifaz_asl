"use client";

import { useState } from "react";
import { FileText, Search, Filter, Download, Loader2 } from "lucide-react";
import ExportProgressToast from "@/components/erp/ExportProgressToast";

const mockStudents = [
  { id: "s1", name: "Muhammad Ahmad bin Khalid", class: "Hifz-A", attendance: 94.5, grade: "A" },
  { id: "s2", name: "Aisha bint Yusuf", class: "Hifz-B", attendance: 98.2, grade: "A+" },
  { id: "s3", name: "Omar bin Abdullah", class: "Hifz-A", attendance: 87.0, grade: "B+" },
  { id: "s4", name: "Fatima bint Hassan", class: "Hifz-C", attendance: 91.3, grade: "A-" },
  { id: "s5", name: "Ibrahim bin Ali", class: "Hifz-B", attendance: 78.5, grade: "C+" },
];

export default function StudentProgressReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBatchExport = () => {
    if (selectedIds.size === 0) return;
    setActiveTaskId(`batch-${Date.now()}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-wide">
            STUDENT PROGRESS REPORTS
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate print-ready PDF progress reports for selected students.
          </p>
        </div>
        <button
          onClick={handleBatchExport}
          disabled={selectedIds.size === 0}
          className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 disabled:opacity-40 text-primary text-xs font-bold px-4 py-2 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          EXPORT SELECTED ({selectedIds.size})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded text-xs text-slate-800 placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Student List */}
      <div className="glass-panel rounded-lg border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-card/60">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filtered.length && filtered.length > 0}
                  onChange={() => {
                    if (selectedIds.size === filtered.length) {
                      setSelectedIds(new Set());
                    } else {
                      setSelectedIds(new Set(filtered.map((s) => s.id)));
                    }
                  }}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Student Name</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Class</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Attendance</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Grade</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr
                key={student.id}
                className="border-b border-border/50 hover:bg-primary/5 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-2.5 text-slate-800 font-medium">{student.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{student.class}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={`font-bold ${
                      student.attendance >= 90 ? "text-green-400" : student.attendance >= 80 ? "text-yellow-400" : "text-red-400"
                    }`}
                  >
                    {student.attendance}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-slate-800 font-bold">{student.grade}</td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => setActiveTaskId(`single-${student.id}-${Date.now()}`)}
                    className="flex items-center gap-1 text-primary hover:text-primary/80 text-[10px] font-bold"
                  >
                    <FileText className="w-3 h-3" />
                    GENERATE PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExportProgressToast taskId={activeTaskId} />
    </div>
  );
}
