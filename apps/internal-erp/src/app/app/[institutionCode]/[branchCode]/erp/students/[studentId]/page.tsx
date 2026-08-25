"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { 
  User, BookOpen, HeartPulse, GraduationCap, 
  Calendar, CheckCircle2, Play, Pause, AlertTriangle 
} from "lucide-react";

export default function StudentProfileERP() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "welfare">("academics");

  // Mock data for Phase 2 implementation
  const student = {
    name: "Saeed Al-Hasan",
    rollNo: params.studentId as string,
    currentJuz: 15,
    status: "Active",
  };

  const hifzPlan = {
    status: "ACTIVE",
    targetJuz: 30,
    targetDate: "2027-12-30",
    dailyNew: 1.5,
    dailyRevision: 5,
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-black font-semibold p-6 space-y-6">
      
      {/* 1. Header & Identity Card */}
      <div className="p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center">
            <User className="h-8 w-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">{student.name}</h1>
            <p className="text-sm text-slate-700 font-medium font-mono">Roll: {student.rollNo} • Status: <span className="text-emerald-400">{student.status}</span></p>
          </div>
        </div>
        <div className="px-6 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl text-center">
          <span className="text-[10px] text-slate-700 font-medium uppercase font-mono tracking-widest block">Current Level</span>
          <span className="text-xl font-bold text-cyan-400">Juz {student.currentJuz}</span>
        </div>
      </div>

      {/* 2. Apple HIG Segmented Control for Tabs */}
      <div className="flex p-1 space-x-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl w-fit backdrop-blur-md">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
            activeTab === "overview" ? "bg-[rgba(255,255,255,0.08)] text-black font-semibold shadow-sm" : "text-slate-700 font-medium hover:text-slate-200"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab("academics")}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
            activeTab === "academics" ? "bg-[rgba(255,255,255,0.08)] text-black font-semibold shadow-sm" : "text-slate-700 font-medium hover:text-slate-200"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Academics (Phase 2)</span>
        </button>
        <button 
          onClick={() => setActiveTab("welfare")}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
            activeTab === "welfare" ? "bg-[rgba(255,255,255,0.08)] text-black font-semibold shadow-sm" : "text-slate-700 font-medium hover:text-slate-200"
          }`}
        >
          <HeartPulse className="h-4 w-4" />
          <span>Welfare</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      <div className="mt-6">
        
        {/* ACADEMICS TAB */}
        {activeTab === "academics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Hifz Plan Card */}
            <div className="p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    <span>Active Hifz Plan</span>
                  </h2>
                  <p className="text-xs text-slate-700 font-medium mt-1">Strategic memorization targets</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-mono uppercase tracking-wider">
                  {hifzPlan.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[rgba(0,0,0,0.2)] rounded-xl border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] text-slate-700 font-medium uppercase font-mono block">Target Juz</span>
                  <span className="text-xl font-bold text-slate-200">{hifzPlan.targetJuz}</span>
                </div>
                <div className="p-4 bg-[rgba(0,0,0,0.2)] rounded-xl border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] text-slate-700 font-medium uppercase font-mono block">Target Date</span>
                  <span className="text-xl font-bold text-slate-200">{hifzPlan.targetDate}</span>
                </div>
                <div className="p-4 bg-[rgba(0,0,0,0.2)] rounded-xl border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] text-slate-700 font-medium uppercase font-mono block">Daily New (Sabaq)</span>
                  <span className="text-xl font-bold text-cyan-400">{hifzPlan.dailyNew} pgs</span>
                </div>
                <div className="p-4 bg-[rgba(0,0,0,0.2)] rounded-xl border border-[rgba(255,255,255,0.02)]">
                  <span className="text-[10px] text-slate-700 font-medium uppercase font-mono block">Daily Revision (Sabqi/Manzil)</span>
                  <span className="text-xl font-bold text-purple-400">{hifzPlan.dailyRevision} pgs</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                <button className="flex-1 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-slate-200 transition-colors flex items-center justify-center space-x-2">
                  <span>Edit Plan</span>
                </button>
                <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm text-amber-400 transition-colors flex items-center justify-center space-x-2">
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </button>
                <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm text-emerald-400 transition-colors flex items-center justify-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Complete</span>
                </button>
              </div>
            </div>

            {/* Completion Workflow Card */}
            <div className="p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl space-y-6">
               <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-purple-400" />
                    <span>Completion Workflow</span>
                  </h2>
                  <p className="text-xs text-slate-700 font-medium mt-1">Manage promotion and graduation</p>
                </div>
              </div>

              <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800 font-medium">Current Status:</span>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[10px] font-mono uppercase tracking-wider">
                    PENDING_REVIEW
                  </span>
                </div>

                <div className="space-y-2">
                  <button className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm text-emerald-400 transition-colors">
                    Approve (Ustad)
                  </button>
                  <button className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-sm text-rose-400 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Progress Tree Link */}
            <div className="lg:col-span-2 p-6 bg-gradient-to-r from-[rgba(255,255,255,0.02)] to-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] rounded-2xl backdrop-blur-xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Memorization Progress Tree</h3>
                <p className="text-sm text-slate-700 font-medium mt-1">View the complete 30 Juz visual breakdown and history.</p>
              </div>
              <a 
                href={`/app/${params.institutionCode}/${params.branchCode}/erp/students/${student.rollNo}/progress`} 
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>View Tree</span>
                <Play className="h-4 w-4" />
              </a>
            </div>

          </div>
        )}

        {/* OVERVIEW TAB PLACEHOLDER */}
        {activeTab === "overview" && (
           <div className="p-12 text-center text-slate-700 font-medium border border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl">
             General overview content will appear here.
           </div>
        )}

        {/* WELFARE TAB PLACEHOLDER */}
        {activeTab === "welfare" && (
           <div className="p-12 text-center text-slate-700 font-medium border border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl flex flex-col items-center">
             <AlertTriangle className="h-8 w-8 text-amber-500/50 mb-3" />
             Health and safeguarding records will appear here.
           </div>
        )}

      </div>

    </div>
  );
}
