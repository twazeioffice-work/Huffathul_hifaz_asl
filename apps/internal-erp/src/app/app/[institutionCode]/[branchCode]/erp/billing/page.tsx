"use client";
import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DollarSign, Receipt, Landmark, FileText, ArrowRight } from "lucide-react";

export default function BillingPage() {
  const { institutionCode, branchCode } = useParams() as { institutionCode: string; branchCode: string };
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Financial Billing & Invoicing</h1>
        <p className="text-xs text-slate-500">Student fee collection, automated receipt generation, and fee schedules.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Total Dues Pending</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">?1,45,000</p>
          <span className="text-[10px] text-slate-400 mt-1 block">18 Students</span>
        </GlassCard>
        
        <GlassCard className="p-5">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Collected Fees (MTD)</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">?8,52,500</p>
          <span className="text-[10px] text-emerald-600 mt-1 block">94.2% On-Time</span>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Ledger Balance (SCB)</span>
          <p className="text-2xl font-bold text-cyan-600 mt-1">?21,50,000</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Bank Reconciled</span>
        </GlassCard>

        <GlassCard className="p-5">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Unreconciled Receipts</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">14</p>
          <span className="text-[10px] text-amber-600 mt-1 block">Requires Review</span>
        </GlassCard>
      </div>
      
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Quick Billing Operations</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            href={`/app/${institutionCode}/${branchCode}/erp/billing/collect`} 
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            <span>Collect Fee Payment</span>
          </Link>
          <Link 
            href={`/app/${institutionCode}/${branchCode}/erp/billing/due-schedule`} 
            className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>View Student Due Schedules</span>
          </Link>
          <Link 
            href={`/app/${institutionCode}/${branchCode}/erp/ledger`} 
            className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Landmark className="h-4 w-4" />
            <span>View General Ledger</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
