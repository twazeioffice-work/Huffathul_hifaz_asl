"use client";

import React from "react";
import { Fingerprint, Calendar, ArrowUpRight } from "lucide-react";
import { useLedgerInspector } from "../hooks/useLedgerInspector";
import LedgerTransactionDrawer from "./LedgerTransactionDrawer";

// Sample structural dataset matched to Phase 6 deep ledger logs
const sampleTransactions = [
  { id: "tx_94821034", entry: "JE-2026-0819-001", hash: "8f7e2a4b9c1d...", amt: "₹28,500.00", desc: "Hifz Tuition Collection - Student ID: SUH-2026-0421 (Hyderabad)", date: "09:15 UTC" },
  { id: "tx_94821035", entry: "JE-2026-0819-002", hash: "2c3d4e5f6a7b...", amt: "₹65,000.00", desc: "Teacher Honorarium & Faculty Disbursement - August 2026 (Bengaluru)", date: "10:30 UTC" },
  { id: "tx_94821036", entry: "JE-2026-0819-003", hash: "e3b0c44298fc...", amt: "₹36,000.00", desc: "Campus Solar Grid Maintenance & Battery Servicing (Mumbai)", date: "12:00 UTC" }
];

export default function DoubleEntryVaultCard() {
  const {
    inspectTransaction,
    closeInspector,
    isDrawerOpen,
    activeTransaction,
    isLoading,
    error,
  } = useLedgerInspector();

  return (
    <div className="p-6 bg-[#090D16] border border-teal-950/60 rounded-xl space-y-6 relative overflow-hidden text-[#FAF9F6]">
      {/* Decorative neon linear grid line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-500/10 via-emerald-400 to-teal-500/10" />

      {/* Card Header block */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-bold tracking-wide text-emerald-400">
              Double-Entry Financial Vault Inspector
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            Real-time verification audit of immutable ledger blocks
          </p>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded border border-emerald-950/60 uppercase">
          LEDGER HARDENED
        </span>
      </div>

      {/* Recent Cryptographic Ledger Entries Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-slate-400 border-b border-slate-900 pb-2">
          <span>Cryptographic Entry Descriptor</span>
          <span className="text-right">Balance Post (INR)</span>
        </div>

        <div className="divide-y divide-slate-900/50">
          {sampleTransactions.map((tx) => (
            <div
              key={tx.id}
              className="py-3 flex items-center justify-between group transition-all"
            >
              <div className="space-y-1 max-w-[75%]">
                <div className="flex items-center gap-2">
                  {/* INTERACTIVE TRACEBACK LINK TRIGGER */}
                  <button
                    onClick={() => inspectTransaction(tx.id)}
                    className="text-sm font-bold text-[#FAF9F6] group-hover:text-emerald-400 transition-all text-left flex items-center gap-1.5 focus:outline-none"
                  >
                    <span className="underline decoration-slate-800 group-hover:decoration-emerald-500 transition-all">
                      {tx.entry}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </button>

                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-900">
                    Hash: {tx.hash}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{tx.desc}</p>
              </div>

              <div className="text-right flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-semibold font-mono text-emerald-400">
                  {tx.amt}
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {tx.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Drawer Overlay Injector */}
      <LedgerTransactionDrawer
        isOpen={isDrawerOpen}
        onClose={closeInspector}
        transaction={activeTransaction}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
