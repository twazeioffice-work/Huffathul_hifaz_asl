'use client';

import React, { useState } from 'react';

interface Asset {
  id: string;
  name: string;
  category: 'Fleet' | 'Real Estate' | 'Hardware';
  assignedTo: string;
  purchaseValue: number;
  currentBookValue: number;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'ALLOCATED';
}

const INITIAL_ASSETS: Asset[] = [
  { id: 'AST-101', name: 'Campus Bus #04 (Toyota Coaster)', category: 'Fleet', assignedTo: 'North Route Driver Br. Salman', purchaseValue: 45000, currentBookValue: 38250, status: 'OPERATIONAL' },
  { id: 'AST-102', name: 'Campus Van #02 (HiAce)', category: 'Fleet', assignedTo: 'Gulshan Route', purchaseValue: 28000, currentBookValue: 21500, status: 'MAINTENANCE' },
  { id: 'AST-201', name: 'Dormitory Block A - Room 104', category: 'Real Estate', assignedTo: '4 Hifz Students (Residential)', purchaseValue: 120000, currentBookValue: 114000, status: 'ALLOCATED' },
  { id: 'AST-301', name: 'Admin Server Rack (Dell PowerEdge)', category: 'Hardware', assignedTo: 'Central Server Room', purchaseValue: 8500, currentBookValue: 5100, status: 'OPERATIONAL' },
];

export default function AssetManagementDashboard() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isDepreciating, setIsDepreciating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunDepreciation = () => {
    setIsDepreciating(true);
    setTimeout(() => {
      setAssets(prev => prev.map(a => ({
        ...a,
        currentBookValue: Math.round(a.currentBookValue * 0.95),
      })));
      setIsDepreciating(false);
      showToast('MACRS Automated Depreciation Applied! -5% calculated across all registered assets.');
    }, 1500);
  };

  const filteredAssets = selectedCategory === 'ALL'
    ? assets
    : assets.filter(a => a.category === selectedCategory);

  const totalValue = assets.reduce((sum, a) => sum + a.currentBookValue, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-200 shadow-glow-emerald backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Physical Asset & Fleet Ledger
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Enterprise Infrastructure</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            IoT GPS Bus Telemetry • Dormitory Bed Allocations • Automated Asset Depreciation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDepreciation}
            disabled={isDepreciating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-950/50 hover:border-emerald-400 transition-all shadow-glow-emerald active:scale-95 disabled:opacity-50"
          >
            <span className={`w-2 h-2 rounded-full ${isDepreciating ? 'bg-amber-400 animate-spin' : 'bg-emerald-400'}`}></span>
            {isDepreciating ? 'Calculating MACRS...' : '⚡ Run Depreciation Cycle'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Portfolio Value</div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight mb-1">
            ${totalValue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400">Combined book value across 4 institutional categories.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Transport Fleet</div>
          <div className="text-3xl font-black text-cyan-400 tracking-tight mb-1">
            12 Vehicles
          </div>
          <p className="text-xs text-slate-400">10 Operational • 2 Under Maintenance (IoT Active).</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dormitory Beds</div>
          <div className="text-3xl font-black text-indigo-300 tracking-tight mb-1">
            150 / 160
          </div>
          <p className="text-xs text-slate-400">93.7% Residential Occupancy Rate across 4 hostels.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Asset Register & Valuation Ledger</h2>
            <p className="text-xs text-slate-400">Click any category to filter live hardware & physical properties.</p>
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'Fleet', 'Real Estate', 'Hardware'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Asset ID</th>
                <th className="pb-3 px-3">Asset Name</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Assigned Scope</th>
                <th className="pb-3 px-3">Original Cost</th>
                <th className="pb-3 px-3">Current Book Value</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-cyan-400 font-semibold">{asset.id}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-200">{asset.name}</td>
                  <td className="py-3.5 px-3 text-slate-400">{asset.category}</td>
                  <td className="py-3.5 px-3 text-slate-300">{asset.assignedTo}</td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono">${asset.purchaseValue.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-emerald-300 font-mono font-bold">${asset.currentBookValue.toLocaleString()}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      asset.status === 'OPERATIONAL'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : asset.status === 'MAINTENANCE'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-950 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
