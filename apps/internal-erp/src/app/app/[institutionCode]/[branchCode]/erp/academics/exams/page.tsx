"use client";
import React from "react";
import { BookOpen } from "lucide-react";

export default function ExamModulePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="text-purple-400" /> Examination Center</h1>
          <p className="text-slate-400 text-sm">Schedule exams, input grading, and calculate aggregates.</p>
        </div>
      </div>
      <div className="bg-black/20 border border-white/5 rounded-2xl p-8 text-center text-slate-500">
        Exam Management UI Placeholder
      </div>
    </div>
  );
}
