"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Users, Briefcase, Calendar, Star, FileText, 
  Clock, ChevronRight, CheckCircle 
} from "lucide-react";

export default function HRDashboardPhase4() {
  const params = useParams();
  const router = useRouter();
  const { institutionCode, branchCode } = params;
  
  const baseUrl = `/app/${institutionCode}/${branchCode}/erp/hr`;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div>
          <span className="text-xs text-blue-400 font-mono tracking-widest uppercase">{institutionCode}-{branchCode}</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2 mt-1">
            <Briefcase className="h-6 w-6 text-blue-400" />
            <span>HR & Payroll Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Phase 4: Comprehensive Staff Management</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Active Staff</span>
              <h3 className="text-xl font-bold text-blue-400 mt-1">42 Personnel</h3>
            </div>
            <Users className="h-4 w-4 text-blue-400/50" />
          </div>
        </div>
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Today's Attendance</span>
              <h3 className="text-xl font-bold text-emerald-400 mt-1">98% Present</h3>
            </div>
            <CheckCircle className="h-4 w-4 text-emerald-400/50" />
          </div>
        </div>
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Pending Leaves</span>
              <h3 className="text-xl font-bold text-amber-400 mt-1">3 Requests</h3>
            </div>
            <Calendar className="h-4 w-4 text-amber-400/50" />
          </div>
        </div>
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Next Payroll Run</span>
              <h3 className="text-xl font-bold text-purple-400 mt-1">In 5 Days</h3>
            </div>
            <Clock className="h-4 w-4 text-purple-400/50" />
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <h2 className="text-lg font-semibold text-slate-200 mt-8 mb-4">HR Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Attendance & Leaves */}
        <div 
          onClick={() => router.push(`${baseUrl}/attendance`)}
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-emerald-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Attendance & Leaves</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400 mt-2">Track daily check-ins, resolve absences, and approve leave requests.</p>
        </div>

        {/* Payroll Processing */}
        <div 
          onClick={() => router.push(`${baseUrl}/payroll`)}
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-purple-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Payroll Processing</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400 mt-2">Generate monthly payroll batches, apply deductions, and issue payslips.</p>
        </div>

        {/* Performance Reviews */}
        <div 
          onClick={() => router.push(`${baseUrl}/reviews`)}
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-amber-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Star className="h-6 w-6 text-amber-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Performance Reviews</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-400 mt-2">Conduct periodic reviews, track Ustad KPIs, and record feedback.</p>
        </div>
      </div>
    </div>
  );
}
