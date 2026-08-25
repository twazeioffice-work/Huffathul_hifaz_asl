"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Receipt, ArrowLeft, Plus, Search, MoreHorizontal } from "lucide-react";

export default function ExpensesPage() {
  const router = useRouter();
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [expenses] = useState([
    {
      id: "EXP-001",
      requestedBy: "Dr. Faisal K.",
      purpose: "Classroom Interactive Boards",
      amount: "₹8,50,000",
      date: "2026-08-10",
      status: "REQUESTED",
    },
    {
      id: "EXP-002",
      requestedBy: "Er. Faisal K.",
      purpose: "Solid Teak Quran Storage Cabinets",
      amount: "₹4,50,000",
      date: "2026-08-05",
      status: "APPROVED",
    },
    {
      id: "EXP-003",
      requestedBy: "Moulana Sajid Rahman",
      purpose: "Library Books Replenishment",
      amount: "₹45,000",
      date: "2026-08-02",
      status: "PAID",
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
              <Receipt className="h-6 w-6 text-rose-400" />
              <span>Expense Approvals</span>
            </h1>
            <p className="text-sm text-slate-700 font-medium mt-1">Review, approve, or reject branch expense requests</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-rose-900/20">
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-slate-700 font-medium" />
          <input 
            type="text" 
            placeholder="Search by Request ID, Requester, or Purpose..." 
            className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 font-medium bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] uppercase">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Request ID</th>
              <th className="px-6 py-4 font-medium tracking-wider">Requester</th>
              <th className="px-6 py-4 font-medium tracking-wider">Purpose</th>
              <th className="px-6 py-4 font-medium tracking-wider">Amount</th>
              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
              <th className="px-6 py-4 font-medium tracking-wider">Date</th>
              <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="px-6 py-4 font-mono text-rose-400 font-semibold">{expense.id}</td>
                <td className="px-6 py-4 font-medium text-slate-200">{expense.requestedBy}</td>
                <td className="px-6 py-4 text-slate-800 font-medium">{expense.purpose}</td>
                <td className="px-6 py-4 font-mono font-medium text-slate-200">{expense.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    expense.status === 'PAID' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : expense.status === 'APPROVED'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : expense.status === 'REQUESTED'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      : 'bg-slate-500/10 text-slate-700 font-medium border border-slate-500/20'
                  }`}>
                    {expense.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700 font-medium font-mono">{expense.date}</td>
                <td className="px-6 py-4 text-right">
                  {expense.status === 'REQUESTED' ? (
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold uppercase tracking-wider transition-colors">Approve</button>
                      <button className="text-xs text-slate-700 font-medium hover:text-rose-400 font-semibold uppercase tracking-wider transition-colors">Reject</button>
                    </div>
                  ) : (
                    <button className="text-slate-700 font-medium hover:text-rose-400 transition-colors p-1">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
