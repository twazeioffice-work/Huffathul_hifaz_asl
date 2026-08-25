"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Landmark, ArrowLeft, RefreshCw, FileText, CheckCircle, Search, AlertCircle } from "lucide-react";

export default function BankReconciliationPage() {
  const router = useRouter();
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [statements] = useState([
    {
      id: "REC-2026-08",
      bankName: "Standard Chartered Bank",
      accountNo: "**** 4511",
      statementDate: "2026-08-01",
      ledgerBalance: "₹7,00,50,000",
      bankBalance: "₹7,00,50,000",
      status: "RECONCILED",
      discrepancy: "₹0",
    },
    {
      id: "REC-2026-08-02",
      bankName: "Al Baraka Bank",
      accountNo: "**** 9901",
      statementDate: "2026-08-01",
      ledgerBalance: "₹15,20,000",
      bankBalance: "₹14,90,000",
      status: "DISCREPANCY",
      discrepancy: "₹30,000",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#09090b] text-black font-semibold p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push(`/app/${institutionCode}/${branchCode}/erp/finance`)}
            className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-800 font-medium" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 text-emerald-400" />
              <span>Bank Reconciliation</span>
            </h1>
            <p className="text-sm text-slate-700 font-medium mt-1">Match internal ledgers against physical bank statements</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20">
          <FileText className="h-4 w-4" />
          <span>Upload Statement</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-slate-700 font-medium" />
          <input 
            type="text" 
            placeholder="Search by Bank, Account, or Reference..." 
            className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 font-medium bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] uppercase">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Record ID</th>
              <th className="px-6 py-4 font-medium tracking-wider">Bank Details</th>
              <th className="px-6 py-4 font-medium tracking-wider">Ledger Bal.</th>
              <th className="px-6 py-4 font-medium tracking-wider">Bank Bal.</th>
              <th className="px-6 py-4 font-medium tracking-wider">Discrepancy</th>
              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
              <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {statements.map((stmt) => (
              <tr key={stmt.id} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="px-6 py-4 font-mono text-emerald-400 font-semibold">{stmt.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-200 flex items-center space-x-2">
                    <Landmark className="h-4 w-4 text-slate-700 font-medium" />
                    <span>{stmt.bankName}</span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium font-mono mt-0.5">{stmt.accountNo}</div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-800 font-medium">{stmt.ledgerBalance}</td>
                <td className="px-6 py-4 font-mono text-slate-800 font-medium">{stmt.bankBalance}</td>
                <td className="px-6 py-4 font-mono">
                  <span className={stmt.discrepancy === '₹0' ? 'text-slate-500' : 'text-rose-400 font-bold'}>
                    {stmt.discrepancy}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {stmt.status === 'RECONCILED' ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="h-3 w-3" />
                      <span>{stmt.status}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <AlertCircle className="h-3 w-3" />
                      <span>{stmt.status}</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold uppercase tracking-wider transition-colors">
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
