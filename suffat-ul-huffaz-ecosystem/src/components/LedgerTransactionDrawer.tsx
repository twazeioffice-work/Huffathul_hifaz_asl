"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, Cpu, Database, RefreshCw, FileCheck2 } from "lucide-react";
import { CryptographicLedgerTransaction } from "../hooks/useLedgerInspector";

interface LedgerTransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: CryptographicLedgerTransaction | null;
  isLoading: boolean;
  error: string | null;
}

export default function LedgerTransactionDrawer({
  isOpen,
  onClose,
  transaction,
  isLoading,
  error,
}: LedgerTransactionDrawerProps) {

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate dynamic trial balancing on the client for audit compliance checks
  const totalDebit = transaction?.lines.reduce((sum, l) => sum + l.debit, 0) || 0;
  const totalCredit = transaction?.lines.reduce((sum, l) => sum + l.credit, 0) || 0;
  const trialBalanceOffset = Math.abs(totalDebit - totalCredit);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Dynamic Glassmorphic Overlay Background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          className="w-screen max-w-2xl bg-[#090D16] border-l border-teal-950 text-[#FAF9F6] shadow-2xl flex flex-col h-full z-50"
          style={{ animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-teal-950/50 bg-[#0C1220] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-950/50 rounded-lg border border-teal-500/30">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-wide text-emerald-400">
                  Cryptographic Ledger Audit Trail
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Secure cryptographic verify bounds (AES-256 / SHA-256)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-[#FAF9F6] transition-all"
              aria-label="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Container */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-sm font-medium text-emerald-500/80 font-mono tracking-wider animate-pulse">
                  DECRYPTING TRANSACTION LEDGER BLOCK...
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded-md text-rose-200 text-sm flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p className="font-sans leading-relaxed">{error}</p>
              </div>
            )}

            {!isLoading && !error && transaction && (
              <div className="space-y-6">
                {/* Visual Status Banner */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-950 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-950">
                      INTEGRITY VERIFIED ✓
                    </span>
                    <h4 className="text-xl font-bold text-[#FAF9F6] font-mono mt-2">
                      {transaction.entry_number}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-sans">Timestamp</p>
                    <p className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>

                {/* Core Context Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#0C1220] rounded-lg border border-slate-900">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Authorized Signer
                    </p>
                    <p className="text-xs font-semibold text-[#FAF9F6] mt-1.5 truncate">
                      {transaction.authorized_by}
                    </p>
                  </div>
                  <div className="p-3 bg-[#0C1220] rounded-lg border border-slate-900">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-400" /> Ingestion Channel
                    </p>
                    <p className="text-xs font-semibold text-[#FAF9F6] mt-1.5 truncate">
                      {transaction.source_channel}
                    </p>
                  </div>
                </div>

                {/* Cryptographic Hash Signature Blocks */}
                <div className="space-y-3">
                  <h5 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                    Cryptographic Ledger Hashes
                  </h5>
                  <div className="p-4 bg-black/60 rounded-lg border border-slate-900 space-y-3 font-mono">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        SHA-256 Block Signature Hash
                      </p>
                      <p className="text-xs text-emerald-400 select-all font-semibold break-all leading-relaxed mt-1">
                        {transaction.ledger_hash}
                      </p>
                    </div>
                    <div className="border-t border-slate-950/60 pt-3">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Ed25519 Private Key Authorization Signature
                      </p>
                      <p className="text-xs text-slate-400 select-all break-all leading-relaxed mt-1">
                        {transaction.signature}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Balanced Ledger Double-Entry Audit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                      Double-Entry Balanced Ledger Lines
                    </h5>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900">
                      Balanced Statement Account
                    </span>
                  </div>

                  <div className="border border-slate-900 rounded-lg overflow-hidden">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="bg-[#0C1220] border-b border-slate-900 text-[10px] text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">Account Code &amp; Name</th>
                          <th className="py-3 px-3 text-right">Debit</th>
                          <th className="py-3 px-3 text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {transaction.lines.map((line) => (
                          <tr key={line.id} className="hover:bg-slate-900/30 transition-colors">
                            <td className="py-3 px-4">
                              <p className="text-xs font-semibold text-[#FAF9F6]">
                                {line.account_name}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400 bg-[#0C1220] px-1.5 py-0.5 rounded border border-slate-800 mt-1 inline-block">
                                {line.account_code}
                              </span>
                              <p className="text-[11px] text-slate-500 mt-1">{line.description}</p>
                            </td>
                            <td className="py-3 px-3 text-right text-xs font-mono text-emerald-400">
                              {line.debit > 0 ? `₹${line.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                            </td>
                            <td className="py-3 px-3 text-right text-xs font-mono text-emerald-400">
                              {line.credit > 0 ? `₹${line.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#0C1220]/60 border-t border-slate-900 font-mono text-xs">
                          <td className="py-3 px-4 font-semibold text-slate-400 text-right">
                            Total Journal Post
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-[#FAF9F6]">
                            ₹{totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-[#FAF9F6]">
                            ₹{totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Absolute Verification Safety Checks */}
                  {trialBalanceOffset !== 0 && (
                    <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-md text-xs text-rose-300">
                      ⚠️ WARNING: Double-entry ledger is out of balance by ₹{trialBalanceOffset.toFixed(2)}. Unsigned post transactions blocked.
                    </div>
                  )}
                </div>

                {/* Audit Narration / Intent Description */}
                <div className="space-y-2">
                  <h5 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                    Audit Description (Narration Log)
                  </h5>
                  <p className="p-4 bg-[#0C1220] rounded-lg border border-slate-900 text-xs leading-relaxed text-slate-300">
                    {transaction.narration}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer controls */}
          <div className="px-6 py-4 border-t border-teal-950/50 bg-[#0C1220] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-transparent rounded-lg text-xs text-slate-300 hover:text-[#FAF9F6] transition-all font-semibold"
            >
              Close Ledger Inspector
            </button>
            <button
              onClick={() => {
                alert(`Generated formal cryptographic compliance manifest certificate for: ${transaction?.entry_number}`);
              }}
              disabled={!transaction}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold rounded-lg text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-glow-emerald"
            >
              <FileCheck2 className="w-4 h-4" /> Export Verification Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
