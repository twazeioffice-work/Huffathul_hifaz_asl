"use client";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, TrendingUp, TrendingDown, FileText } from "lucide-react";

const MOCK_ENTRIES = [
  { id: "TXN-8991", date: "2026-08-20", desc: "Student Tuition Fees", type: "credit", amount: 12500, balance: 145000 },
  { id: "TXN-8992", date: "2026-08-21", desc: "Utility Bills (Electricity)", type: "debit", amount: 850, balance: 144150 },
  { id: "TXN-8993", date: "2026-08-22", desc: "Charity Donation", type: "credit", amount: 5000, balance: 149150 },
];

export default function MasterLedgerPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Ledger</h1>
          <p className="text-sm text-slate-500">Institutional general ledger and financial reconciliation.</p>
        </div>
        <Button variant="primary" className="flex gap-2 items-center"><FileText size={16}/> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-slate-500 mb-2">Total Operating Balance</h3>
          <p className="text-4xl font-bold text-slate-800">$149,150.00</p>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2 text-green-400"><TrendingUp size={16}/> +12% this month</div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/5 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-500 font-medium">Date</th>
              <th className="p-4 text-slate-500 font-medium">Txn ID</th>
              <th className="p-4 text-slate-500 font-medium">Description</th>
              <th className="p-4 text-slate-500 font-medium text-right">Debit (-)</th>
              <th className="p-4 text-slate-500 font-medium text-right">Credit (+)</th>
              <th className="p-4 text-slate-500 font-medium text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ENTRIES.map(entry => (
              <tr key={entry.id} className="border-b border-slate-200 hover:bg-black/5">
                <td className="p-4 text-slate-500">{entry.date}</td>
                <td className="p-4 text-slate-500">{entry.id}</td>
                <td className="p-4 text-slate-800">{entry.desc}</td>
                <td className="p-4 text-red-400 text-right">{entry.type === 'debit' ? `$${entry.amount}` : '-'}</td>
                <td className="p-4 text-green-400 text-right">{entry.type === 'credit' ? `$${entry.amount}` : '-'}</td>
                <td className="p-4 text-slate-800 font-medium text-right">${entry.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
