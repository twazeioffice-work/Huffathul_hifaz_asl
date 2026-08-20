"use client";

import React from 'react';
import { useDashboardInspector } from '@/hooks/useDashboardInspector';
import { MetricInspectorDrawer } from './inspectors/MetricInspectorDrawer';

// Tailwind glassmorphism styles applied to provide premium, high-fidelity visual polish
const metricCardStyles = `
  p-5 bg-gradient-to-br from-[#0D152D] to-[#0A0E22] 
  border border-cyan-500/10 rounded-2xl 
  hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/5 
  cursor-pointer transition-all duration-300 transform hover:-translate-y-1 
  flex flex-col justify-between group h-full
`;

export const OverviewMetricsGrid: React.FC = () => {
  const { isOpen, activeType, branchContext, openInspector, closeInspector } = useDashboardInspector();

  return (
    <div className="relative">
      {/* Overview Metrics 4-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* CARD 1: Total Portfolio Value */}
        <div
          onClick={() => openInspector('PORTFOLIO_VALUE')}
          className={metricCardStyles}
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Finances &amp; Reserves
              </span>
              <span className="text-xs font-extrabold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20">
                Live
              </span>
            </div>
            <h4 className="text-xs font-semibold text-white/70 mt-2">Total Portfolio Value</h4>
            <div className="text-2xl font-black text-white mt-1 tracking-tight group-hover:text-cyan-300 transition-colors">
              ₹14.82 Cr
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              ● Debits/Credits Balanced
            </span>
            <span className="text-[11px] text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Trace Ledger →
            </span>
          </div>
        </div>

        {/* CARD 2: Active Transport Fleet */}
        <div
          onClick={() => openInspector('TRANSPORT_FLEET')}
          className={metricCardStyles}
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Fleet Logistics
              </span>
              <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                32 Active
              </span>
            </div>
            <h4 className="text-xs font-semibold text-white/70 mt-2">Active Transport Fleet</h4>
            <div className="text-2xl font-black text-white mt-1 tracking-tight group-hover:text-cyan-300 transition-colors">
              36 Vehicles
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              ● All GPS Streams OK
            </span>
            <span className="text-[11px] text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Trace Fleet →
            </span>
          </div>
        </div>

        {/* CARD 3: Dormitory Bed Capacity */}
        <div
          onClick={() => openInspector('DORMITORY_CAPACITY')}
          className={metricCardStyles}
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Student Housing
              </span>
              <span className="text-xs font-extrabold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20">
                94% Occupied
              </span>
            </div>
            <h4 className="text-xs font-semibold text-white/70 mt-2">Dormitory Bed Capacity</h4>
            <div className="text-2xl font-black text-white mt-1 tracking-tight group-hover:text-cyan-300 transition-colors">
              1,128 / 1,200
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
              ● 72 Available Beds
            </span>
            <span className="text-[11px] text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Audit Beds →
            </span>
          </div>
        </div>

        {/* CARD 4: Physical Assets Registry */}
        <div
          onClick={() => openInspector('PHYSICAL_ASSETS')}
          className={metricCardStyles}
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Assets &amp; Inventory
              </span>
              <span className="text-xs font-extrabold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20">
                RFID Synced
              </span>
            </div>
            <h4 className="text-xs font-semibold text-white/70 mt-2">Tracked Institutional Assets</h4>
            <div className="text-2xl font-black text-white mt-1 tracking-tight group-hover:text-cyan-300 transition-colors">
              4,850 Units
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Verified Aug 2026
            </span>
            <span className="text-[11px] text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Open Registry →
            </span>
          </div>
        </div>

      </div>

      {/* Slide-over Portal Controller rendering */}
      <MetricInspectorDrawer
        isOpen={isOpen}
        activeType={activeType}
        branchContext={branchContext}
        onClose={closeInspector}
      />
    </div>
  );
};

export default OverviewMetricsGrid;
