"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Megaphone, Search, Plus, Pin, Calendar, MoreHorizontal, ArrowRight, BookOpen, AlertTriangle } from "lucide-react";

export default function NoticeBoardAdminPage() {
  const router = useRouter();
  const { institutionCode, branchCode } = useParams();

  const [notices] = useState([
    {
      id: "NTC-001",
      title: "Eid-ul-Fitr Holidays Schedule",
      body: "All classes will be suspended for 4 days starting tomorrow.",
      category: "EVENT",
      audience: "ALL",
      priority: true,
      expiryDate: "2026-08-30",
    },
    {
      id: "NTC-002",
      title: "Hifz Revision Test",
      body: "Quarterly revision test for Senior batches is scheduled for next Monday.",
      category: "EXAM",
      audience: "SPECIFIC_BATCH",
      priority: false,
      expiryDate: "2026-09-05",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
            <Megaphone className="h-6 w-6 text-indigo-400" />
            <span>Notice Board Admin</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Create and broadcast announcements to portals</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Notice</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search notices..." 
            className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {notices.map((notice) => (
          <div key={notice.id} className="p-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl hover:border-indigo-500/30 transition-colors flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  {notice.priority && <Pin className="h-4 w-4 text-rose-400 fill-rose-400/20" />}
                  <h3 className="text-lg font-bold text-slate-100">{notice.title}</h3>
                </div>
                <button className="text-slate-500 hover:text-slate-300 transition-colors"><MoreHorizontal className="h-5 w-5"/></button>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {notice.body}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-[10px] uppercase font-bold tracking-wider">
                  {notice.category}
                </span>
                <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md text-[10px] uppercase font-bold tracking-wider">
                  Target: {notice.audience}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-500 font-mono">
                <Calendar className="h-3 w-3" />
                <span>Exp: {notice.expiryDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
