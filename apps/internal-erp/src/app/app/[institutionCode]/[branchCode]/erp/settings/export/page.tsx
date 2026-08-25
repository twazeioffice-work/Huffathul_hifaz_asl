"use client";

import React from "react";
import { Download, FileText, Users, CreditCard, ShieldAlert, MessageSquare, Briefcase, FileOutput } from "lucide-react";

export default function ExportCenterPage() {
  const exportModules = [
    { title: "Students Data", desc: "Export complete student roster with demographics", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Staff Directory", desc: "Export HR and payroll assignment lists", icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Academic Records", desc: "Export Sabaq progress and exam scores", icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Finance Ledger", desc: "Export transaction history, fees, and expenses", icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Complaints Log", desc: "Export resolved and pending grievances", icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { title: "WhatsApp Logs", desc: "Export message delivery status and histories", icon: MessageSquare, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-black font-semibold p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black font-semibold flex items-center space-x-2">
            <FileOutput className="h-6 w-6 text-purple-400" />
            <span>Export Center</span>
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">Generate and download structural data reports from the ERP.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportModules.map((mod, i) => (
          <div key={i} className="p-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl hover:border-purple-500/30 transition-colors flex flex-col justify-between h-48">
            <div className="space-y-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.bg} ${mod.border} border`}>
                <mod.icon className={`h-5 w-5 ${mod.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-black font-medium">{mod.title}</h3>
                <p className="text-sm text-slate-700 font-medium mt-1 leading-snug">{mod.desc}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <button className="flex-1 py-2 text-xs font-semibold bg-black/5 hover:bg-black/5 border border-slate-200 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Download className="h-3 w-3" />
                <span>CSV</span>
              </button>
              <button className="flex-1 py-2 text-xs font-semibold bg-black/5 hover:bg-black/5 border border-slate-200 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
