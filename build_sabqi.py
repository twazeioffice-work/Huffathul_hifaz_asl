import os

FILE_PATH = r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\app\app\[institutionCode]\[branchCode]\erp\academics\sabqi\page.tsx"

CODE = """\"use client\";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, CheckCircle, Clock, Search, User } from "lucide-react";

// Mock Data for UI Demonstration
const MOCK_STUDENTS = [
  { id: "STU-001", name: "Ahmed Abdullah", status: "pending", currentJuz: 15 },
  { id: "STU-002", name: "Omar Farooq", status: "completed", currentJuz: 3 },
  { id: "STU-003", name: "Zaid Bin Harith", status: "pending", currentJuz: 30 },
  { id: "STU-004", name: "Ali Hassan", status: "absent", currentJuz: 12 },
  { id: "STU-005", name: "Bilal Rabah", status: "pending", currentJuz: 7 },
];

export default function SabqiPage() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    startJuz: "",
    endJuz: "",
    pages: "0",
    mistakes: "0",
    grade: "A",
  });

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const activeStudent = MOCK_STUDENTS.find(s => s.id === selectedStudent);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="success">Completed</Badge>;
      case "absent": return <Badge variant="danger">Absent</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Sabqi (Recent Revision)</h1>
          <p className="text-sm text-zinc-400">Track and evaluate recent revisions (usually the last 1-2 Juz).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><User size={24} /></div>
          <div>
            <p className="text-sm text-zinc-400">Total Students</p>
            <p className="text-2xl font-bold text-white">15</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm text-zinc-400">Sabqi Heard</p>
            <p className="text-2xl font-bold text-white">5</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm text-zinc-400">Pending</p>
            <p className="text-2xl font-bold text-white">10</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student List */}
        <GlassCard className="lg:col-span-1 p-0 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student.id)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${
                  selectedStudent === student.id 
                    ? "bg-indigo-500/20 border border-indigo-500/30" 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{student.name}</p>
                  <p className="text-xs text-zinc-500">{student.id}</p>
                </div>
                {getStatusBadge(student.status)}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Right Column: Evaluation Form */}
        <div className="lg:col-span-2">
          {selectedStudent && activeStudent ? (
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">{activeStudent.name}</h2>
                  <p className="text-sm text-zinc-400">ID: {activeStudent.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1">Current Target Juz</p>
                  <Badge variant="default">Juz {activeStudent.currentJuz}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Starting Juz / Ruba'</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Juz 15" 
                    value={formData.startJuz}
                    onChange={(e) => setFormData({...formData, startJuz: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Ending Juz / Ruba'</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Juz 15 (Half)" 
                    value={formData.endJuz}
                    onChange={(e) => setFormData({...formData, endJuz: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Total Pages Revised</label>
                  <Input 
                    type="number" 
                    placeholder="Number of pages" 
                    value={formData.pages}
                    onChange={(e) => setFormData({...formData, pages: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Mistakes / Hesitations</label>
                  <Input 
                    type="number" 
                    value={formData.mistakes}
                    onChange={(e) => setFormData({...formData, mistakes: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Grade</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  >
                    <option value="A+">A+ (Flawless)</option>
                    <option value="A">A (Strong)</option>
                    <option value="B">B (Acceptable)</option>
                    <option value="C">C (Weak - Needs Re-revision)</option>
                    <option value="F">F (Unacceptable)</option>
                  </select>
                </div>
              </div>

              <div className="mt-auto flex gap-4 justify-end pt-4 border-t border-white/10">
                <Button variant="secondary" onClick={() => setSelectedStudent(null)}>Cancel</Button>
                <Button variant="primary" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Save Sabqi Record
                </Button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-indigo-500/10 rounded-full mb-4">
                <RefreshCw className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Select a Student</h2>
              <p className="text-zinc-400 max-w-md">
                Choose a student to log their daily Sabqi evaluation.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
"""

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(CODE)
print("Updated Sabqi Page")
