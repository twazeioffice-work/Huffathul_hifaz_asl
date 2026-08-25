'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function KPIStudentsList() {
  const router = useRouter();
  const params = useParams();
  const { institutionCode, branchCode, kpiId, centerId } = params as { institutionCode: string, branchCode: string, kpiId: string, centerId: string };

  const getKPITitle = () => {
    switch(kpiId) {
      case 'retention': return 'Overall Retention Rate';
      case 'sabaq': return 'Avg Sabaq Memorization';
      case 'graduates': return 'Graduated Huffaz (2026)';
      case 'fees': return 'Fee Collection Velocity';
      default: return 'KPI Metrics';
    }
  };

  const getMetricTitle = () => {
    switch(kpiId) {
      case 'retention': return 'Attendance %';
      case 'sabaq': return 'Pages / Day';
      case 'graduates': return 'Completion Date';
      case 'fees': return 'Outstanding Dues';
      default: return 'Metric';
    }
  };

  const dummyStudents = [
    { id: 'STU001', name: 'Abdullah Khan', grade: 'Hifz Class A', metric: kpiId === 'retention' ? '100%' : kpiId === 'sabaq' ? '1.5' : kpiId === 'graduates' ? 'Jan 15, 2026' : '$0.00' },
    { id: 'STU002', name: 'Umar Farooq', grade: 'Hifz Class A', metric: kpiId === 'retention' ? '98%' : kpiId === 'sabaq' ? '1.2' : kpiId === 'graduates' ? 'Mar 01, 2026' : '$150.00' },
    { id: 'STU003', name: 'Zaid bin Thabit', grade: 'Hifz Class B', metric: kpiId === 'retention' ? '95%' : kpiId === 'sabaq' ? '1.0' : kpiId === 'graduates' ? 'Jun 20, 2026' : '$0.00' },
    { id: 'STU004', name: 'Hassan Ali', grade: 'Hifz Class B', metric: kpiId === 'retention' ? '88%' : kpiId === 'sabaq' ? '0.75' : kpiId === 'graduates' ? 'Sep 10, 2026' : '$300.00' },
    { id: 'STU005', name: 'Ali Akbar', grade: 'Hifz Class A', metric: kpiId === 'retention' ? '100%' : kpiId === 'sabaq' ? '2.0' : kpiId === 'graduates' ? 'Feb 05, 2026' : '$0.00' },
  ];

  const centerName = centerId === 'C001' ? 'Main Campus HQ' : centerId === 'C002' ? 'North Branch' : 'South Branch';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-[#F4F1ED] p-4 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          ← 
        </button>
        <div>
          <h1 className="text-2xl font-black text-black">{getKPITitle()} - {centerName}</h1>
          <p className="text-sm text-slate-600">Student-level data for this specific metric.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-4 p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Student Name</div>
          <div>Class</div>
          <div>{getMetricTitle()}</div>
        </div>
        <div className="divide-y divide-slate-100">
          {dummyStudents.map(student => (
            <div 
              key={student.id}
              className="grid grid-cols-4 p-4 items-center hover:bg-cyan-50/50 transition-colors"
            >
              <div className="col-span-2 font-semibold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div>{student.name}</div>
                  <div className="text-[10px] text-slate-400">{student.id}</div>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {student.grade}
              </div>
              <div className={`font-mono font-bold ${kpiId === 'fees' && student.metric !== '$0.00' ? 'text-rose-500' : 'text-emerald-600'}`}>
                {student.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
