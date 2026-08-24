"use client";
import React from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

export default function AcademicCalendarPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarIcon className="text-emerald-400" /> Academic Calendar</h1>
          <p className="text-slate-400 text-sm">Manage terms, holidays, and examination periods.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>
      <div className="bg-black/20 border border-white/5 rounded-2xl p-8 text-center text-slate-500">
        Calendar Grid UI Placeholder
      </div>
    </div>
  );
}
