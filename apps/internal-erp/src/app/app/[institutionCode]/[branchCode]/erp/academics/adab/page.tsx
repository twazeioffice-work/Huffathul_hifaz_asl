"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Heart, Search, User, CheckCircle, ShieldAlert, Star } from "lucide-react";

const MOCK_STUDENTS = [
  { id: "STU-001", name: "Ahmed Abdullah", behavior: "excellent" },
  { id: "STU-002", name: "Omar Farooq", behavior: "good" },
  { id: "STU-003", name: "Zaid Bin Harith", behavior: "needs_attention" },
  { id: "STU-004", name: "Ali Hassan", behavior: "good" },
  { id: "STU-005", name: "Bilal Rabah", behavior: "excellent" },
];

export default function AdabPage() {
    const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [behaviorScore, setBehaviorScore] = useState<number>(10);

  useEffect(() => {
    setRemarks("");
    setBehaviorScore(10);
  }, [selectedStudent]);
  
  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const activeStudent = MOCK_STUDENTS.find(s => s.id === selectedStudent);

  const getBehaviorBadge = (behavior: string) => {
    switch (behavior) {
      case "excellent": return <Badge variant="success">Excellent</Badge>;
      case "needs_attention": return <Badge variant="danger">Attention Needed</Badge>;
      default: return <Badge variant="default">Good</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black font-semibold">Adab & Tarbiyah</h1>
          <p className="text-sm text-slate-700 font-medium">Monitor student behavior, discipline, and moral development.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student List */}
        <GlassCard className="lg:col-span-1 p-0 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 font-medium w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full bg-black/5 border border-slate-200 rounded-md py-2 pl-9 pr-4 text-sm text-black font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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
                    : "hover:bg-black/5 border border-transparent"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-black font-semibold">{student.name}</p>
                  <p className="text-xs text-slate-700 font-medium">{student.id}</p>
                </div>
                {getBehaviorBadge(student.behavior)}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Right Column: Evaluation Form */}
        <div className="lg:col-span-2">
          {selectedStudent && activeStudent ? (
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-black font-semibold">{activeStudent.name}</h2>
                  <p className="text-sm text-slate-700 font-medium">ID: {activeStudent.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-800 font-medium mb-2">Behavior Evaluation</label>
                                    <div className="pt-4 pb-2 px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={behaviorScore}
                      onChange={(e) => setBehaviorScore(Number(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                      style={{ background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)' }}
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-700 mt-2">
                      <span className="text-red-600">Needs Attention (0)</span>
                      <span className="text-amber-600">Satisfactory (5)</span>
                      <span className="text-green-600">Excellent (10)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 font-medium mb-2">Remarks / Observations</label>
                  <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} 
                    rows={4}
                    className="w-full bg-black/5 border border-slate-200 rounded-md px-3 py-2 text-black font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 custom-scrollbar"
                    placeholder="Enter notes on student's character, discipline, or punctuality..."
                  ></textarea>
                </div>
              </div>

              <div className="mt-auto flex gap-4 justify-end pt-4 border-t border-slate-200">
                <Button variant="secondary" onClick={() => setSelectedStudent(null)}>Cancel</Button>
                <Button variant="primary" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Save Evaluation
                </Button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-indigo-500/10 rounded-full mb-4">
                <Heart className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-black font-semibold mb-2">Select a Student</h2>
              <p className="text-slate-700 font-medium max-w-md">
                Choose a student to log their behavioral and moral development progress.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
