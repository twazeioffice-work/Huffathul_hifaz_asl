"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  DollarSign, Landmark, Receipt, FileText, 
  CreditCard, PieChart, Users, ChevronRight, Activity 
} from "lucide-react";

export default function FinanceDashboardPhase3() {
  const params = useParams();
  const router = useRouter();
  const { institutionCode, branchCode } = params;
  
  const baseUrl = `/app/${institutionCode}/${branchCode}/erp/finance`;

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-800 p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div>
          <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">{institutionCode}-{branchCode}</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2 mt-1">
            <Landmark className="h-6 w-6 text-emerald-400" />
            <span>Financial Vault & Ledger Tracker</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Phase 3: Comprehensive Finance Module</p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Total Revenue YTD</span>
              <h3 className="text-xl font-bold text-emerald-400 mt-1">₹45,20,000</h3>
            </div>
            <DollarSign className="h-4 w-4 text-emerald-400/50" />
          </div>
        </div>
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Pending Invoices</span>
              <h3 className="text-xl font-bold text-rose-400 mt-1">12 Drafts</h3>
            </div>
            <FileText className="h-4 w-4 text-rose-400/50" />
          </div>
        </div>
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Active Sponsorships</span>
              <h3 className="text-xl font-bold text-cyan-400 mt-1">18 Sponsors</h3>
            </div>
            <Users className="h-4 w-4 text-cyan-400/50" />
          </div>
        </div>
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Pending Approvals</span>
              <h3 className="text-xl font-bold text-amber-400 mt-1">4 Requests</h3>
            </div>
            <Activity className="h-4 w-4 text-amber-400/50" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Grid for Phase 3 Components */}
      <h2 className="text-lg font-semibold text-slate-200 mt-8 mb-4">Finance Sub-Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Sponsorship Lifecycle */}
        <div 
          onClick={() => router.push(`${baseUrl}/sponsorships`)}
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-cyan-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-cyan-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Sponsorship Lifecycle</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-2">Manage student sponsors, payment schedules, and progress updates.</p>
        </div>

        {/* Expense Approvals */}
        <div 
          onClick={() => router.push(`${baseUrl}/expenses`)}
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-rose-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Receipt className="h-6 w-6 text-rose-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Expense Approvals</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-2">Review, approve, or reject branch expense requests workflows.</p>
        </div>

        {/* Bank Reconciliation */}
        <div 
          onClick={() => router.push(`${baseUrl}/reconciliation`)}
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-emerald-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Landmark className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Bank Reconciliation</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-2">Reconcile internal double-entry ledgers with physical bank statements.</p>
        </div>

        {/* Fee Structures & Invoices */}
        <div 
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-purple-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Fee Structures & Invoicing</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-2">Manage fee heads, generate invoices, and log receipts/waivers.</p>
        </div>

        {/* Budget vs Actual */}
        <div 
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-amber-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PieChart className="h-6 w-6 text-amber-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Budget vs Actual</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-2">View branch budget allocations and track actual expenses against them.</p>
        </div>

        {/* Accounting Periods */}
        <div 
          className="group cursor-pointer p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-blue-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300"
        >
          <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-md font-semibold text-slate-100 flex items-center justify-between">
            <span>Accounting Periods</span>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-2">Lock and close financial periods to prevent retrospective tampering.</p>
        </div>

      </div>
    </div>
  );
}
