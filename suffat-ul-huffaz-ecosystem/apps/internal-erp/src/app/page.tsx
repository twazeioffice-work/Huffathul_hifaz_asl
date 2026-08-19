'use client';

import React, { useState } from 'react';
import { useApprovalInspector } from '@/hooks/useApprovalInspector';
import ApprovalInspectorDrawer from '@/components/erp/ApprovalInspectorDrawer';
import { useLedgerInspector } from '@/hooks/useLedgerInspector';
import LedgerTransactionDrawer from '@/components/LedgerTransactionDrawer';
import { OverviewMetricsGrid } from '@/components/dashboard/OverviewMetricsGrid';

const ADMISSION_QUEUE = [
  { id: 'stud_bilal_101', name: 'Muhammad Bilal Khan', branch: 'Bengaluru Campus (Jayanagar)', hifzLevel: 'Para 12', time: '10m ago' },
  { id: 'stud_abdullah_102', name: 'Abdullah Siddiqui', branch: 'Hyderabad Campus (Tolichowki)', hifzLevel: 'Beginner Nazra', time: '35m ago' },
  { id: 'stud_zainab_103', name: 'Zainab Fatima', branch: 'Mumbai Campus (Bandra West)', hifzLevel: 'Para 5', time: '1h ago' },
];

const LEDGER_TRANSACTIONS = [
  { id: 'tx_94821034', entry: 'JE-2026-0819-001', hash: '8f7e2a4b9c1d...', amt: '₹28,500.00', desc: 'Hifz Tuition Collection - Student ID: SUH-2026-0421 (Hyderabad)', date: '09:15 UTC' },
  { id: 'tx_94821035', entry: 'JE-2026-0819-002', hash: '2c3d4e5f6a7b...', amt: '₹65,000.00', desc: 'Teacher Honorarium & Faculty Disbursement (Bengaluru)', date: '10:30 UTC' },
  { id: 'tx_94821036', entry: 'JE-2026-0819-003', hash: 'e3b0c44298fc...', amt: '₹36,000.00', desc: 'Campus Solar Grid Maintenance & Battery Servicing (Mumbai)', date: '12:00 UTC' }
];

export default function DashboardCommandCenter() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [queue, setQueue] = useState(ADMISSION_QUEUE);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Approval Inspector hook (Admissions)
  const { isInspectorOpen, inspectedId, inspectorType, inspect, closeInspector } = useApprovalInspector();

  // 2. Ledger Inspector hook (Cryptographic Double-Entry Vault)
  const {
    inspectTransaction,
    closeInspector: closeLedgerInspector,
    isDrawerOpen: isLedgerDrawerOpen,
    activeTransaction,
    isLoading: isLedgerLoading,
    error: ledgerError,
  } = useLedgerInspector();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveSuccess = (id: string) => {
    const student = queue.find(s => s.id === id);
    setQueue(prev => prev.filter(s => s.id !== id));
    showToast(`✅ ${student?.name || 'Student'} approved & enrolled successfully!`);
  };

  const handleTriggerSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      showToast('Distributed Edge Mesh synchronized across Kerala, Lucknow, Bengaluru & Srinagar!');
      setTimeout(() => setSyncStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-200 shadow-glow-cyan backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Multi-Tenant Command Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Suffat-ul Huffaz <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Autonomous Ecosystem</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            HQ Governance Portal • Active Tenant: <strong className="text-slate-200">suffat-hq (Hyderabad Central Campus, India)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-950/50 hover:border-cyan-400 transition-all shadow-glow-cyan active:scale-95 disabled:opacity-50"
          >
            <span className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-spin' : 'bg-emerald-400'}`}></span>
            {syncStatus === 'syncing' ? 'Syncing Node Mesh...' : syncStatus === 'synced' ? 'Mesh Synced ✓' : 'Trigger Edge Sync'}
          </button>

          <button
            onClick={() => setActiveModal('admissions')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 text-xs font-bold hover:brightness-110 shadow-glow-cyan transition-all active:scale-95"
          >
            + Quick Admission
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
       *  1. INTERACTIVE OVERVIEW METRICS GRID (4 Deep-Dive Cards)
       * ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Institutional Telemetry &amp; Asset Portfolios
          </h3>
          <span className="text-[11px] text-cyan-400">Click any metric card below to open deep audit drawer &rarr;</span>
        </div>
        <OverviewMetricsGrid />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
       *  2. OPERATIONAL WORKFLOW HUBS (Admissions, Vault, Edge Mesh)
       * ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Admissions Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>CAMPUS INTAKE</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px]">Live</span>
          </div>
          <div className="text-3xl font-black text-white tracking-tight mb-1">
            {queue.length} <span className="text-xs font-normal text-slate-400">Pending Reviews</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Cross-campus Hifz intake applications awaiting biometric &amp; parent verification.</p>
          <button
            onClick={() => setActiveModal('admissions')}
            className="w-full py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 group-hover:bg-cyan-950/30 transition-all"
          >
            Review Applications &rarr;
          </button>
        </div>

        {/* Vault Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>DOUBLE-ENTRY VAULT</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">Balanced</span>
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight mb-1">
            ₹11,85,000 <span className="text-xs font-normal text-slate-400">Aug Net Revenue</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Immutable zero-discrepancy ledger: 100% Debit/Credit equilibrium verified.</p>
          <button
            onClick={() => setActiveModal('vault')}
            className="w-full py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 group-hover:bg-emerald-950/30 transition-all"
          >
            Open Financial Vault &rarr;
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
       *  MODAL OVERLAYS (Admissions, Vault, Mesh)
       * ═══════════════════════════════════════════════════════════════════ */}
      {activeModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {activeModal === 'admissions' && '📋 Live Admissions Processing Queue'}
                {activeModal === 'vault' && '🔐 Double-Entry Financial Vault Inspector'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* ── ADMISSIONS QUEUE ── */}
            {activeModal === 'admissions' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Reviewing {queue.length} pending cross-tenant applicants across Indian campuses.
                  <span className="text-cyan-400 ml-1">Click a student name or button to inspect full Indian profile &amp; address →</span>
                </p>

                {queue.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    🎉 All pending admissions have been processed for this shift.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {queue.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
                        <div>
                          <button
                            onClick={() => {
                              setActiveModal(null);
                              setTimeout(() => inspect(app.id, 'student_admission'), 150);
                            }}
                            className="group text-left focus:outline-none"
                            aria-label={`Inspect ${app.name}`}
                          >
                            <span className="text-sm font-bold text-slate-200 group-hover:text-[#00F0FF] group-hover:underline underline-offset-4 decoration-[#00F0FF] transition-all cursor-pointer">
                              {app.name}
                            </span>
                          </button>
                          <div className="text-xs text-slate-400">
                            {app.branch} • Target: <span className="text-cyan-400">{app.hifzLevel}</span> ({app.time})
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveModal(null);
                            setTimeout(() => inspect(app.id, 'student_admission'), 150);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors shadow-glow-emerald"
                        >
                          Inspect &amp; Enroll &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── VAULT (INTERACTIVE CRYPTOGRAPHIC AUDIT ROWS) ── */}
            {activeModal === 'vault' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                  <div><strong>Total Ledger Debits:</strong> ₹40,50,000.00</div>
                  <div><strong>Total Ledger Credits:</strong> ₹40,50,000.00</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span>Recent Cryptographic Ledger Entries (INR):</span>
                    <span className="text-[11px] text-emerald-400 font-normal">Click any entry to inspect audit trail &rarr;</span>
                  </div>
                  <div className="divide-y divide-slate-800 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                    {LEDGER_TRANSACTIONS.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => {
                          setActiveModal(null);
                          setTimeout(() => inspectTransaction(tx.id), 150);
                        }}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-all cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400 group-hover:underline underline-offset-2 flex items-center gap-1">
                              {tx.entry}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                              {tx.hash}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px]">{tx.desc}</p>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div>
                            <span className="font-mono font-bold text-white text-xs block">{tx.amt}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{tx.date}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModal(null);
                              setTimeout(() => inspectTransaction(tx.id), 150);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-950/80 border border-teal-500/40 text-emerald-300 text-[10px] font-bold group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all"
                          >
                            Inspect &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
       *  APPROVAL INSPECTOR DRAWER (global mount point for Admissions)
       * ═══════════════════════════════════════════════════════════════════ */}
      <ApprovalInspectorDrawer
        isOpen={isInspectorOpen}
        itemId={inspectedId}
        type={inspectorType}
        onClose={closeInspector}
        onApproveSuccess={handleApproveSuccess}
      />

      {/* ═══════════════════════════════════════════════════════════════════
       *  LEDGER TRANSACTION DRAWER (global mount point for Financial Vault)
       * ═══════════════════════════════════════════════════════════════════ */}
      <LedgerTransactionDrawer
        isOpen={isLedgerDrawerOpen}
        onClose={closeLedgerInspector}
        transaction={activeTransaction}
        isLoading={isLedgerLoading}
        error={ledgerError}
      />

    </div>
  );
}
