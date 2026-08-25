"use client";

import React, { useState } from "react";
import { Megaphone, Pin, Calendar, Search } from "lucide-react";

export default function StudentNoticesPage() {
  const [notices] = useState([
    {
      id: "NTC-001",
      title: "Eid-ul-Fitr Holidays Schedule",
      body: "All classes will be suspended for 4 days starting tomorrow.",
      category: "EVENT",
      priority: true,
      posted: "2 days ago",
    },
    {
      id: "NTC-002",
      title: "Hifz Revision Test",
      body: "Quarterly revision test for Senior batches is scheduled for next Monday. Ensure all pending sabaq is cleared.",
      category: "EXAM",
      priority: false,
      posted: "5 hours ago",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-black/50 border border-slate-200 rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center space-x-2">
            <Megaphone className="h-6 w-6 text-indigo-400" />
            <span>Notice Board</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Official announcements and updates from the center</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search notices..." 
            className="w-full bg-black/5 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {notices.map((notice) => (
          <div key={notice.id} className="p-5 bg-white/40 border border-slate-200 hover:bg-white/60 rounded-2xl backdrop-blur-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${notice.priority ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  {notice.priority ? <Pin className="h-5 w-5" /> : <Megaphone className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{notice.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-black/5 text-slate-500 rounded text-[10px] uppercase font-bold tracking-wider">
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{notice.posted}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-4 pl-12">
              {notice.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
