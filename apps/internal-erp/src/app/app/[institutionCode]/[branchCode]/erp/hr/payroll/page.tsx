"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, ArrowLeft, Plus, Download, MoreHorizontal, Settings } from "lucide-react";

export default function PayrollPage() {
  const router = useRouter();
  const { institutionCode, branchCode } = useParams();

  const [payrolls] = useState([
    {
      id: "PR-2026-08",
      month: "August 2026",
      staffCount: 42,
      totalAmount: "₹12,45,000",
      status: "DRAFT",
      paymentDate: "--",
    },
    {
      id: "PR-2026-07",
      month: "July 2026",
      staffCount: 41,
      totalAmount: "₹12,10,000",
      status: "PAID",
      paymentDate: "2026-08-01",
    },
  ]);

  return (
    <div className="min-h-screen bg-transparent text-black font-semibold p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push(`/app/${institutionCode}/${branchCode}/erp/hr`)}
            className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-800 font-medium" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black font-semibold flex items-center space-x-2">
              <FileText className="h-6 w-6 text-purple-400" />
              <span>Payroll Processing</span>
            </h1>
            <p className="text-sm text-slate-700 font-medium mt-1">Manage salary structures and generate monthly payrolls</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-black font-semibold px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-[rgba(255,255,255,0.1)] flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Structures</span>
          </button>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Generate Run</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 font-medium bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] uppercase">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Run ID</th>
              <th className="px-6 py-4 font-medium tracking-wider">Month</th>
              <th className="px-6 py-4 font-medium tracking-wider">Staff Count</th>
              <th className="px-6 py-4 font-medium tracking-wider">Total Amount</th>
              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
              <th className="px-6 py-4 font-medium tracking-wider">Payment Date</th>
              <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {payrolls.map((run) => (
              <tr key={run.id} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="px-6 py-4 font-mono text-purple-400 font-semibold">{run.id}</td>
                <td className="px-6 py-4 font-medium text-black font-medium">{run.month}</td>
                <td className="px-6 py-4 text-slate-800 font-medium">{run.staffCount}</td>
                <td className="px-6 py-4 font-mono font-medium text-black font-medium">{run.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    run.status === 'PAID' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : run.status === 'APPROVED'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : run.status === 'PENDING_APPROVAL'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      : 'bg-slate-500/10 text-slate-700 font-medium border border-slate-500/20'
                  }`}>
                    {run.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700 font-medium font-mono">{run.paymentDate}</td>
                <td className="px-6 py-4 text-right">
                  {run.status === 'DRAFT' || run.status === 'PENDING_APPROVAL' ? (
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-xs text-purple-400 hover:text-purple-300 font-semibold uppercase tracking-wider transition-colors">Review</button>
                    </div>
                  ) : (
                    <button className="text-slate-700 font-medium hover:text-emerald-400 transition-colors p-1" title="Download Bank Export">
                      <Download className="h-5 w-5" />
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
