"use client";
import React from "react";
import { Cpu } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-800 p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Cpu className="text-indigo-400" /> AI Safety Layer</h1>
          <p className="text-slate-500 text-sm">Configure prompt boundaries and logging for the GenAI module.</p>
        </div>
      </div>
      <div className="bg-black/5 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
        AI Safety Layer UI Placeholder
      </div>
    </div>
  );
}
