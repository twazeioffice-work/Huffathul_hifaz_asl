"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, Search, Plus, Calendar, Mail, Phone, MoreHorizontal, ArrowLeft } from "lucide-react";

export default function SponsorshipsPage() {
  const router = useRouter();
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [sponsors] = useState([
    {
      id: "SPON-101",
      studentName: "Abdullah Siddiqui",
      sponsorName: "Tariq Ali",
      phone: "+91 9876543210",
      status: "ACTIVE",
      nextDue: "2026-09-01",
    },
    {
      id: "SPON-102",
      studentName: "Fatima Zahra",
      sponsorName: "Zainab Organization",
      phone: "+91 9988776655",
      status: "PENDING_PAYMENT",
      nextDue: "2026-08-15",
    },
  ]);

  return (
    <div className="min-h-screen bg-transparent text-black font-semibold p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push(`/app/${institutionCode}/${branchCode}/erp/finance`)}
            className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-800 font-medium" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black font-semibold flex items-center space-x-2">
              <Users className="h-6 w-6 text-cyan-400" />
              <span>Sponsorship Lifecycle</span>
            </h1>
            <p className="text-sm text-slate-700 font-medium mt-1">Manage external sponsorships for enrolled students</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-cyan-900/20">
          <Plus className="h-4 w-4" />
          <span>Add Sponsor</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-slate-700 font-medium" />
          <input 
            type="text" 
            placeholder="Search by sponsor name, student, or ID..." 
            className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl py-2 pl-10 pr-4 text-sm text-black font-medium focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 font-medium bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] uppercase">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Sponsor Name</th>
              <th className="px-6 py-4 font-medium tracking-wider">Student</th>
              <th className="px-6 py-4 font-medium tracking-wider">Contact</th>
              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
              <th className="px-6 py-4 font-medium tracking-wider">Next Due</th>
              <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {sponsors.map((sponsor) => (
              <tr key={sponsor.id} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-black font-medium">{sponsor.sponsorName}</div>
                  <div className="text-xs text-slate-700 font-medium font-mono mt-0.5">{sponsor.id}</div>
                </td>
                <td className="px-6 py-4 text-slate-800 font-medium">{sponsor.studentName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Phone className="h-3 w-3" />
                    <span>{sponsor.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    sponsor.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {sponsor.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-slate-800 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-700 font-medium" />
                    <span>{sponsor.nextDue}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-700 font-medium hover:text-cyan-400 transition-colors p-1">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
