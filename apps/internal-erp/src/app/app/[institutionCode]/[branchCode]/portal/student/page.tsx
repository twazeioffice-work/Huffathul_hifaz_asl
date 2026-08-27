"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getStudentPortalData } from "./actions";
import Link from "next/link";
import { BookOpen, Star, Calendar, Award, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";

export default function StudentDashboardPage() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [portalData, setPortalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (institutionCode && branchCode) {
      getStudentPortalData(institutionCode, branchCode).then(data => {
        setPortalData(data);
        setLoading(false);
      });
    }
  }, [institutionCode, branchCode]);

  const studentName = portalData?.studentName || "Student User";
  const studentCode = portalData?.studentCode || "STU-26-0001";
  const branchName = portalData?.branchName || "Main Campus";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-cyan-600 uppercase tracking-wider">{branchName} • Student Portal</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{studentName}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Enrollment ID: <span className="font-mono font-semibold text-slate-700">{studentCode}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Current Level</span>
            <span className="text-base font-bold text-cyan-700">Juz 15</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Sabaq Grade</span>
            <span className="text-base font-bold text-emerald-700">A+</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Attendance</span>
            <span className="text-base font-bold text-indigo-700">98.5%</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link 
          href={`/app/${institutionCode}/${branchCode}/portal/student/progress`}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-100/50 rounded-xl text-cyan-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Hifz Progress & Quran Log</h3>
            <p className="text-xs text-slate-500 mt-1">Review Sabaq, Sabqi, and 30 Juz memorization milestones.</p>
          </div>
        </Link>

        <Link 
          href={`/app/${institutionCode}/${branchCode}/portal/student/grievance`}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-100/50 rounded-xl text-rose-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Secure Grievance Registry</h3>
            <p className="text-xs text-slate-500 mt-1">Submit confidential feedback or concerns directly to administration.</p>
          </div>
        </Link>

        <Link 
          href={`/app/${institutionCode}/${branchCode}/portal/student/notices`}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100/50 rounded-xl text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Campus Notice Board</h3>
            <p className="text-xs text-slate-500 mt-1">View official center announcements, holiday lists, and exams.</p>
          </div>
        </Link>
      </div>

      {/* 3. Recent Sabaq Performance */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Sabaq Submissions</h2>
          </div>
          <span className="text-xs text-slate-500">Live academic feed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {(portalData?.sabaqHistory || []).map((entry: any, i: number) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-slate-800">{entry.surah || "Surah Al-Baqarah"}</span>
                <p className="text-xs text-slate-500">Ayah {entry.startAyah || 1} - {entry.endAyah || 25} • Mistakes: {entry.mistakes || 0}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold">
                  Grade {entry.grade || "A"}
                </span>
                <span className="text-[11px] text-slate-400">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
