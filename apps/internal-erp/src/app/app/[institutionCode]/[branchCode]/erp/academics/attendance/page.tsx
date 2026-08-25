"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CalendarCheck, Save, Search, UserCheck, UserX } from "lucide-react";

// Mock Data for UI Demonstration
const INITIAL_STUDENTS = [
  { id: "STU-001", name: "Ahmed Abdullah", status: "present" },
  { id: "STU-002", name: "Omar Farooq", status: "present" },
  { id: "STU-003", name: "Zaid Bin Harith", status: "absent" },
  { id: "STU-004", name: "Ali Hassan", status: "late" },
  { id: "STU-005", name: "Bilal Rabah", status: "leave" },
  { id: "STU-006", name: "Hamza Abdul", status: "present" },
  { id: "STU-007", name: "Tariq Jameel", status: "present" },
];

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, newStatus: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status: string) => {
    setStudents(students.map(s => ({ ...s, status })));
  };

  const getStatusClasses = (currentStatus: string, targetStatus: string) => {
    if (currentStatus !== targetStatus) return "bg-white/5 text-zinc-400 hover:bg-white/10";
    
    switch(targetStatus) {
      case "present": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "absent": return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "late": return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "leave": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Halqa Attendance</h1>
          <p className="text-sm text-slate-500">Mark daily attendance for your Hifz class.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => markAll('present')} className="flex items-center gap-2">
            <UserCheck size={16} /> Mark All Present
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <Save size={16} /> Submit Attendance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-800">{students.length}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center bg-green-500/5">
          <p className="text-sm text-green-400">Present</p>
          <p className="text-2xl font-bold text-green-400">{students.filter(s => s.status === 'present').length}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center bg-red-500/5">
          <p className="text-sm text-red-400">Absent</p>
          <p className="text-2xl font-bold text-red-400">{students.filter(s => s.status === 'absent').length}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center bg-amber-500/5">
          <p className="text-sm text-amber-400">Late / Leave</p>
          <p className="text-2xl font-bold text-amber-400">
            {students.filter(s => s.status === 'late' || s.status === 'leave').length}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full bg-black/5 border border-slate-200 rounded-md py-2 pl-9 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-black/5">
                <th className="p-4 text-sm font-medium text-slate-500">ID</th>
                <th className="p-4 text-sm font-medium text-slate-500">Student Name</th>
                <th className="p-4 text-sm font-medium text-slate-500 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className="border-b border-slate-200 hover:bg-black/5 transition-colors">
                  <td className="p-4 text-sm text-slate-500">{student.id}</td>
                  <td className="p-4 text-sm font-medium text-slate-800">{student.name}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex rounded-lg p-1 bg-black/5 border border-slate-200">
                      <button 
                        onClick={() => updateStatus(student.id, 'present')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${getStatusClasses(student.status, 'present')}`}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => updateStatus(student.id, 'absent')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${getStatusClasses(student.status, 'absent')}`}
                      >
                        Absent
                      </button>
                      <button 
                        onClick={() => updateStatus(student.id, 'late')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${getStatusClasses(student.status, 'late')}`}
                      >
                        Late
                      </button>
                      <button 
                        onClick={() => updateStatus(student.id, 'leave')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${getStatusClasses(student.status, 'leave')}`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No students found matching your search.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
