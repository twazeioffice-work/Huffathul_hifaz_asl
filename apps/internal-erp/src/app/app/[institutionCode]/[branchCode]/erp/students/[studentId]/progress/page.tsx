"use client";

import React from "react";
import { ChevronLeft, CheckCircle2, CircleDashed } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MemorizationProgressTree() {
  const params = useParams();
  
  // Phase 2 mock data for progress tree
  const juzProgress = Array.from({ length: 30 }, (_, i) => {
    const juzNum = i + 1;
    let status = "Not started";
    let progress = 0;
    
    if (juzNum <= 14) {
      status = "Completed";
      progress = 100;
    } else if (juzNum === 15) {
      status = "60%";
      progress = 60;
    }

    return {
      juz: juzNum,
      status,
      progress
    };
  });

  return (
    <div className="min-h-screen bg-transparent text-black font-semibold p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Link 
          href={`/app/${params.institutionCode}/${params.branchCode}/erp/students/${params.studentId}`}
          className="p-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-slate-800 font-medium" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black font-semibold">Memorization Tree</h1>
          <p className="text-sm text-slate-700 font-medium">Student: {params.studentId}</p>
        </div>
      </div>

      <div className="p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {juzProgress.map((juz) => (
            <div 
              key={juz.juz}
              className={`p-4 rounded-xl border relative overflow-hidden ${
                juz.progress === 100 
                  ? "bg-emerald-500/5 border-emerald-500/20" 
                  : juz.progress > 0
                  ? "bg-cyan-500/5 border-cyan-500/20"
                  : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]"
              }`}
            >
              {juz.progress > 0 && juz.progress < 100 && (
                <div 
                  className="absolute left-0 bottom-0 h-1 bg-cyan-500 transition-all"
                  style={{ width: `${juz.progress}%` }}
                />
              )}
              
              <div className="flex justify-between items-center relative z-10">
                <span className="text-lg font-bold text-black font-medium">Juz {juz.juz}</span>
                {juz.progress === 100 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : juz.progress > 0 ? (
                  <span className="text-sm font-mono text-cyan-400">{juz.status}</span>
                ) : (
                  <CircleDashed className="h-5 w-5 text-slate-800 font-medium" />
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium mt-1 uppercase font-mono tracking-wider">
                {juz.progress === 100 ? "Completed" : juz.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
