"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle2, Star, Award, TrendingUp, Sparkles } from "lucide-react";

export default function StudentProgressPage() {
  const [selectedJuz, setSelectedJuz] = useState(15);

  const juzList = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    status: i < 14 ? "COMPLETED" : i === 14 ? "IN_PROGRESS" : "PENDING",
    pages: 20,
    score: i < 14 ? "A+" : i === 14 ? "A" : "-"
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cyan-600" />
            <span>30 Juz Memorization Pathway</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Interactive tracker for completed, active, and upcoming Para milestones.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold font-mono">
            14 / 30 Juz Completed (46.6%)
          </span>
        </div>
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Quranic Index Deck</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {juzList.map(juz => (
            <button
              key={juz.number}
              onClick={() => setSelectedJuz(juz.number)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                selectedJuz === juz.number
                  ? "border-cyan-500 bg-cyan-50/80 ring-2 ring-cyan-500/20"
                  : juz.status === "COMPLETED"
                  ? "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70"
                  : juz.status === "IN_PROGRESS"
                  ? "border-amber-200 bg-amber-50/40 hover:bg-amber-50/70"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 opacity-60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-xs font-bold text-slate-700">Juz {juz.number}</span>
                {juz.status === "COMPLETED" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                {juz.status === "IN_PROGRESS" && <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-500">
                  {juz.status === "COMPLETED" ? "Certified" : juz.status === "IN_PROGRESS" ? "Active" : "Upcoming"}
                </span>
                <span className="text-xs font-mono font-bold text-slate-800">Grade: {juz.score}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
