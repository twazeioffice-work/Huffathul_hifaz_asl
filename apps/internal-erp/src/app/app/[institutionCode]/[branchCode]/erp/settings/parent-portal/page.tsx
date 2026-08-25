"use client";
import React from "react";
import { Users } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent text-black font-semibold p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="text-blue-400" /> Parent Experience Settings</h1>
          <p className="text-slate-700 font-medium text-sm">Configure OTP login, consent terms, and sibling logic.</p>
        </div>
      </div>
      <div className="bg-black/5 border border-slate-200 rounded-2xl p-8 text-center text-slate-700 font-medium">
        Parent Experience Settings UI Placeholder
      </div>
    </div>
  );
}
