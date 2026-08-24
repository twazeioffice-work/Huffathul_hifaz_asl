"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, ArrowLeft, Search, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AttendancePage() {
  const router = useRouter();
  const { institutionCode, branchCode } = useParams();

  const [records] = useState([
    {
      id: "ATT-001",
      staffName: "Moulana Sajid Rahman",
      date: "2026-08-24",
      checkIn: "07:55 AM",
      checkOut: "04:10 PM",
      status: "PRESENT",
    },
    {
      id: "ATT-002",
      staffName: "Dr. Faisal K.",
      date: "2026-08-24",
      checkIn: "--",
      checkOut: "--",
      status: "LEAVE",
    },
    {
      id: "ATT-003",
      staffName: "Qari Abdullah Al-Hafiz",
      date: "2026-08-24",
      checkIn: "08:45 AM",
      checkOut: "--",
      status: "LATE",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push(`/app/${institutionCode}/${branchCode}/erp/hr`)}
            className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-emerald-400" />
              <span>Attendance & Leaves</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Track daily staff check-ins and manage leave requests</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-[rgba(255,255,255,0.1)]">
            View Leaves
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20">
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by staff name or ID..." 
            className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] uppercase">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Staff Member</th>
              <th className="px-6 py-4 font-medium tracking-wider">Date</th>
              <th className="px-6 py-4 font-medium tracking-wider">Check In</th>
              <th className="px-6 py-4 font-medium tracking-wider">Check Out</th>
              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-200">{record.staffName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{record.id}</div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono">{record.date}</td>
                <td className="px-6 py-4 text-slate-300 font-mono">{record.checkIn}</td>
                <td className="px-6 py-4 text-slate-300 font-mono">{record.checkOut}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    record.status === 'PRESENT' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : record.status === 'LATE'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {record.status === 'PRESENT' && <CheckCircle className="h-3 w-3" />}
                    {record.status === 'LATE' && <Clock className="h-3 w-3" />}
                    {record.status === 'LEAVE' && <AlertCircle className="h-3 w-3" />}
                    <span>{record.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
