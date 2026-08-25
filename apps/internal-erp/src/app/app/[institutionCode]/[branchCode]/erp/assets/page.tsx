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
  { id: 'AST-101', name: 'Campus Bus #04 (Tata Starbus)', category: 'Fleet', assignedTo: 'Bengaluru South Route Driver Br. Salman', purchaseValue: 3200000, currentBookValue: 2720000, status: 'OPERATIONAL' },
  { id: 'AST-102', name: 'Campus Van #02 (Force Traveller)', category: 'Fleet', assignedTo: 'Hyderabad Old City Route', purchaseValue: 1800000, currentBookValue: 1450000, status: 'MAINTENANCE' },
  { id: 'AST-201', name: 'Dormitory Block A - Room 104', category: 'Real Estate', assignedTo: '4 Hifz Students (Residential - Hyderabad)', purchaseValue: 8500000, currentBookValue: 8100000, status: 'ALLOCATED' },
  { id: 'AST-301', name: 'Admin Server Rack (Dell PowerEdge)', category: 'Hardware', assignedTo: 'Central Server Room (Hyderabad Hub)', purchaseValue: 650000, currentBookValue: 420000, status: 'OPERATIONAL' },
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
      showToast('MACRS Automated Depreciation Applied! -5% calculated across all registered Indian assets.');
    }, 1500);
  };

  const filteredAssets = selectedCategory === 'ALL'
    ? assets
    : assets.filter(a => a.category === selectedCategory);

  const totalValue = assets.reduce((sum, a) => sum + a.currentBookValue, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-white/90 border border-emerald-500/40 text-emerald-200 shadow-glow-emerald backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Physical Asset &amp; Fleet Ledger
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-black font-semibold tracking-tight">Enterprise Infrastructure (Indian Registry)</h1>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            IoT GPS Bus Telemetry • Dormitory Bed Allocations • Automated MACRS Asset Depreciation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDepreciation}
            disabled={isDepreciating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-950/50 hover:border-emerald-400 transition-all shadow-glow-emerald active:scale-95 disabled:opacity-50"
          >
            <span className={`w-2 h-2 rounded-full ${isDepreciating ? 'bg-amber-400 animate-spin' : 'bg-emerald-400'}`}></span>
            {isDepreciating ? 'Calculating MACRS...' : '⚡ Run Depreciation Cycle'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-emerald-500/40 transition-all">
          <div className="text-xs font-bold text-slate-700 font-medium uppercase tracking-wider mb-2">Total Portfolio Value</div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight mb-1">
            ₹{(totalValue / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-slate-700 font-medium">Combined book value across Indian campus categories (₹{totalValue.toLocaleString('en-IN')}).</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-cyan-500/40 transition-all">
          <div className="text-xs font-bold text-slate-700 font-medium uppercase tracking-wider mb-2">Active Transport Fleet</div>
          <div className="text-3xl font-black text-cyan-400 tracking-tight mb-1">
            12 Vehicles
          </div>
          <p className="text-xs text-slate-700 font-medium">10 Operational • 2 Under Maintenance (IoT Active in Bengaluru &amp; Hyderabad).</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-indigo-500/40 transition-all">
          <div className="text-xs font-bold text-slate-700 font-medium uppercase tracking-wider mb-2">Dormitory Bed Capacity</div>
          <div className="text-3xl font-black text-indigo-400 tracking-tight mb-1">
            94% Filled
          </div>
          <p className="text-xs text-slate-700 font-medium">220 / 235 Residential Hifz Beds Occupied across campuses.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 bg-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['ALL', 'Fleet', 'Real Estate', 'Hardware'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald' : 'text-slate-700 font-medium hover:text-white bg-white border border-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-700 font-medium">
            Showing <strong className="text-black font-semibold">{filteredAssets.length}</strong> Registered Indian Assets
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 font-medium">
            <thead className="bg-white/80 text-[10px] uppercase font-bold text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Asset Tag</th>
                <th className="py-3.5 px-6">Asset Specification</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Assigned Department / Route</th>
                <th className="py-3.5 px-6">Book Value (INR)</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-cyan-400">{asset.id}</td>
                  <td className="py-4 px-6 font-semibold text-black font-semibold">{asset.name}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-800 font-medium border border-slate-200 text-[10px]">
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{asset.assignedTo}</td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-400">
                    ₹{asset.currentBookValue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      asset.status === 'OPERATIONAL'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : asset.status === 'MAINTENANCE'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                        : 'bg-indigo-950/80 text-indigo-400 border-indigo-500/40'
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
