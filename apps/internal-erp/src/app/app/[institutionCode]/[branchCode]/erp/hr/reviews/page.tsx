"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ArrowLeft, Plus, MessageSquare, TrendingUp, BookOpen, AlertTriangle } from "lucide-react";

export default function ReviewsPage() {
  const router = useRouter();
  const { institutionCode, branchCode } = useParams();

  const [reviews] = useState([
    {
      id: "REV-26-01",
      staffName: "Moulana Sajid Rahman",
      role: "USTAD",
      score: 9.4,
      period: "Q2 2026",
      pagesTaught: "145",
      studentGpaTrend: "+0.2",
      behavior: "Excellent",
    },
    {
      id: "REV-26-02",
      staffName: "Dr. Faisal K.",
      role: "CENTER_ADMIN",
      score: 8.8,
      period: "Q2 2026",
      pagesTaught: "--",
      studentGpaTrend: "--",
      behavior: "Satisfactory",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#09090b] text-black font-semibold p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push(`/app/${institutionCode}/${branchCode}/erp/hr`)}
            className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-800 font-medium" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
              <Star className="h-6 w-6 text-amber-400" />
              <span>Performance Reviews</span>
            </h1>
            <p className="text-sm text-slate-700 font-medium mt-1">Track periodic staff and academic faculty KPIs</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-amber-900/20">
          <Plus className="h-4 w-4" />
          <span>New Review</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 font-medium bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] uppercase">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Staff Member</th>
              <th className="px-6 py-4 font-medium tracking-wider">Period</th>
              <th className="px-6 py-4 font-medium tracking-wider">Score</th>
              <th className="px-6 py-4 font-medium tracking-wider">Ustad KPIs</th>
              <th className="px-6 py-4 font-medium tracking-wider">Behavior</th>
              <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-200">{rev.staffName}</div>
                  <div className="text-xs text-amber-400 font-mono mt-0.5">{rev.role}</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800 font-medium">{rev.period}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-100">{rev.score}</span>
                    <span className="text-xs text-slate-700 font-medium">/10</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {rev.role === 'USTAD' ? (
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-slate-800 font-medium">
                        <BookOpen className="h-3 w-3 text-cyan-400" />
                        <span>Pages Taught: <span className="font-mono text-cyan-300">{rev.pagesTaught}</span></span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-800 font-medium">
                        <TrendingUp className="h-3 w-3 text-emerald-400" />
                        <span>Student GPA: <span className="font-mono text-emerald-300">{rev.studentGpaTrend}</span></span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-800 font-medium italic text-xs">N/A for role</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-slate-800 font-medium">
                    <MessageSquare className="h-4 w-4 text-slate-700 font-medium" />
                    <span>{rev.behavior}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider transition-colors">
                    View Details
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
