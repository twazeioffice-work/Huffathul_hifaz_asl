'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';


export default function AnalyticsReportsDashboard() {
  const [timeRange, setTimeRange] = useState<'30D' | 'Q1' | 'YTD'>('30D');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('PDF Executive Report compiled & downloaded successfully!');
    }, 1800);
  };

  const chartData = timeRange === '30D'
    ? [ { label: 'Week 1', value: 85, hifz: 60 }, { label: 'Week 2', value: 92, hifz: 75 }, { label: 'Week 3', value: 110, hifz: 95 }, { label: 'Week 4', value: 128, hifz: 118 } ]
    : timeRange === 'Q1'
    ? [ { label: 'Jan', value: 310, hifz: 220 }, { label: 'Feb', value: 380, hifz: 290 }, { label: 'Mar', value: 440, hifz: 360 } ]
    : [ { label: '2024', value: 850, hifz: 620 }, { label: '2025', value: 1200, hifz: 940 }, { label: '2026', value: 1650, hifz: 1380 } ];

  const maxVal = Math.max(...chartData.map(d => d.value));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-white/90 border border-cyan-500/40 text-cyan-200 shadow-glow-cyan backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Cross-Tenant Analytics Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-black font-semibold tracking-tight">Intelligence & Audit Reports</h1>
          <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
            Academic Sabaq Trajectory • Revenue Forecasting • Retention Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-white border border-slate-200 p-1">
            {(['30D', 'Q1', 'YTD'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                    : 'text-slate-700 font-medium hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-cyan active:scale-95 disabled:opacity-50"
          >
            {isExporting ? 'Generating PDF...' : '📥 Export Audit PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-700 font-medium uppercase tracking-wider mb-1">Overall Retention Rate</div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">98.4%</div>
          <div className="text-[10px] text-emerald-300/80 mt-1">+2.1% from previous term</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-700 font-medium uppercase tracking-wider mb-1">Avg Sabaq Memorization</div>
          <div className="text-2xl font-black text-cyan-400 tracking-tight">1.25 Pages/Day</div>
          <div className="text-[10px] text-cyan-300/80 mt-1">Target: 1.00 Page/Day</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-700 font-medium uppercase tracking-wider mb-1">Graduated Huffaz (2026)</div>
          <div className="text-2xl font-black text-black font-semibold tracking-tight">48 Huffaz</div>
          <div className="text-[10px] text-slate-700 font-medium mt-1">Sanad Certified</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-700 font-medium uppercase tracking-wider mb-1">Fee Collection Velocity</div>
          <div className="text-2xl font-black text-indigo-300 tracking-tight">94.2%</div>
          <div className="text-[10px] text-slate-700 font-medium mt-1">Auto-reconciliation active</div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-black font-semibold">Hifz Completion & Student Influx Velocity</h2>
              <p className="text-xs text-slate-700 font-medium">Visual comparison of new student enrollments vs active Para memorization pace.</p>
            </div>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHifz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" name="Total Enrollment" dataKey="value" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" name="Hifz Milestones" dataKey="hifz" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorHifz)" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
        </div>
      </div>
  );
}
