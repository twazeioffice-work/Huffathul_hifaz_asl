"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  User, BookOpen, HeartPulse, GraduationCap, 
  Calendar, CheckCircle2, Play, Pause, ArrowLeft 
} from "lucide-react";
import { getStudentDetail } from "../../actions";

export default function StudentProfileERP() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "welfare">("academics");
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    if (studentId) {
      getStudentDetail(studentId).then(data => setStudentData(data));
    }
  }, [studentId]);

  const student = {
    name: studentData?.name || `Student (${studentId.slice(0, 8)})`,
    rollNo: studentData?.studentCode || studentId,
    branch: studentData?.branchName || "Main Center",
    currentJuz: studentData?.currentJuz || 15,
    status: studentData?.status || "Active",
  };

  const hifzPlan = {
    status: "ACTIVE",
    targetJuz: 30,
    targetDate: "2027-12-30",
    dailyNew: 1.5,
    dailyRevision: 5,
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 p-6 space-y-6 max-w-5xl mx-auto">
      
      {/* 1. Header & Identity Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-16 w-16 bg-cyan-100 border border-cyan-200 rounded-2xl flex items-center justify-center font-bold text-cyan-700 text-xl font-mono">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{student.name}</h1>
            <p className="text-xs text-slate-500 font-mono">Roll: <span className="font-bold text-slate-800">{student.rollNo}</span> • Branch: {student.branch} • Status: <span className="text-emerald-600 font-bold uppercase">{student.status}</span></p>
          </div>
        </div>
        <div className="px-6 py-3 bg-cyan-50 border border-cyan-100 rounded-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block">Current Level</span>
          <span className="text-xl font-bold text-cyan-700">Juz {student.currentJuz}</span>
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="flex p-1 space-x-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTab === "overview" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab("academics")}
          className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTab === "academics" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Hifz Academics</span>
        </button>
        <button 
          onClick={() => setActiveTab("welfare")}
          className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTab === "welfare" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <HeartPulse className="h-4 w-4" />
          <span>Welfare</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      <div className="mt-6">
        {activeTab === "academics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Hifz Plan Card */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-cyan-600" />
                    <span>Active Hifz Plan</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Strategic memorization trajectory</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
                  {hifzPlan.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Juz</span>
                  <span className="text-lg font-bold text-slate-900">{hifzPlan.targetJuz} Juz</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Date</span>
                  <span className="text-lg font-bold text-slate-900">{hifzPlan.targetDate}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Daily Sabaq</span>
                  <span className="text-lg font-bold text-cyan-700">{hifzPlan.dailyNew} pages</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Daily Revision</span>
                  <span className="text-lg font-bold text-indigo-700">{hifzPlan.dailyRevision} pages</span>
                </div>
              </div>
            </div>

            {/* Completion Workflow Card */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <span>Graduation & Sanad Status</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Sanad certification milestone</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Pathway:</span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-mono font-bold uppercase">
                    ON_TRACK
                  </span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                  Daily sabaq evaluations are actively synced by the assigned Ustad.
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "overview" && (
          <div className="p-12 text-center text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl">
            Admissions and family details for {student.name} ({student.rollNo}).
          </div>
        )}

        {activeTab === "welfare" && (
          <div className="p-12 text-center text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl">
            Health and pastoral care notes are confidential.
          </div>
        )}
      </div>

    </div>
  );
}
