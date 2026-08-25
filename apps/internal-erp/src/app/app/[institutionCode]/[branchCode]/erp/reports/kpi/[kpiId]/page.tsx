'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function KPICentersList() {
  const router = useRouter();
  const params = useParams();
  const { institutionCode, branchCode, kpiId } = params as { institutionCode: string, branchCode: string, kpiId: string };

  const getKPITitle = () => {
    switch(kpiId) {
      case 'retention': return 'Overall Retention Rate';
      case 'sabaq': return 'Avg Sabaq Memorization';
      case 'graduates': return 'Graduated Huffaz (2026)';
      case 'fees': return 'Fee Collection Velocity';
      default: return 'KPI Metrics';
    }
  };

  const dummyCenters = [
    { id: 'C001', name: 'Main Campus HQ', metric: kpiId === 'retention' ? '98.5%' : kpiId === 'sabaq' ? '1.30 Pages/Day' : kpiId === 'graduates' ? '24 Huffaz' : '96.1%' },
    { id: 'C002', name: 'North Branch', metric: kpiId === 'retention' ? '97.2%' : kpiId === 'sabaq' ? '1.15 Pages/Day' : kpiId === 'graduates' ? '12 Huffaz' : '92.4%' },
    { id: 'C003', name: 'South Branch', metric: kpiId === 'retention' ? '99.1%' : kpiId === 'sabaq' ? '1.40 Pages/Day' : kpiId === 'graduates' ? '12 Huffaz' : '98.2%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-[#F4F1ED] p-4 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-black">{getKPITitle()}</h1>
          <p className="text-sm text-slate-600">Select a center to view student-level performance.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Center Name</div>
          <div>{getKPITitle()}</div>
        </div>
        <div className="divide-y divide-slate-100">
          {dummyCenters.map(center => (
            <div 
              key={center.id}
              onClick={() => router.push(`/app/${institutionCode}/${branchCode}/erp/reports/kpi/${kpiId}/${center.id}`)}
              className="grid grid-cols-3 p-4 items-center hover:bg-cyan-50/50 cursor-pointer transition-colors group"
            >
              <div className="col-span-2 font-semibold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
                  {center.id.replace('C', '')}
                </div>
                {center.name}
              </div>
              <div className="font-mono font-bold text-cyan-600 group-hover:text-cyan-700">
                {center.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
