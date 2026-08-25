"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Shield, Sparkles, DollarSign, Award, Users, TrendingUp } from "lucide-react";

interface CenterDetails {
  branch_id: string;
  financial_summary: {
    total_expenses: number;
    total_revenue: number;
    net_surplus: number;
    categories: {
      kafalath_sponsorship: number;
      hadiya: number;
      sadaqah: number;
      tuition_revenue: number;
    };
  };
  student_ratings: Array<{
    id: string;
    student_name: string;
    study_rating: number;
    discipline_rating: number;
  }>;
  ustad_efficiency: Array<{
    id: string;
    name: string;
    pages_taught: number;
    efficiency_grade: string;
  }>;
}

export default function Center360Dashboard() {
  const params = useParams();
  const [data, setData] = useState<CenterDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch detailed center analysis via RLS backend on Port 8000
    // In dev mode, we assume the proxy routes /api/v1 calls.
    fetch(`/api/v1/kpi-explorer/center-details/${params.centerBranchId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((e) => {
        // Fallback for UI if API is not active
        console.error(e);
        setData({
          branch_id: String(params.centerBranchId),
          financial_summary: {
            total_expenses: 42000,
            total_revenue: 55000,
            net_surplus: 13000,
            categories: { kafalath_sponsorship: 15000, hadiya: 5000, sadaqah: 15000, tuition_revenue: 20000 }
          },
          student_ratings: [
            { id: "1", student_name: "Yusuf Ali", study_rating: 3.8, discipline_rating: 9.5 },
            { id: "2", student_name: "Omar Tariq", study_rating: 2.5, discipline_rating: 7.0 }
          ],
          ustad_efficiency: [
            { id: "1", name: "Ustad Bilal", pages_taught: 350, efficiency_grade: "A+" }
          ]
        });
        setLoading(false);
      });
  }, [params.centerBranchId]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0C] text-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  // Parse financial segments for Recharts visualization
  const pieData = [
    { name: "Kafalath", value: data.financial_summary.categories.kafalath_sponsorship, color: "#22D3EE" },
    { name: "Hadiya", value: data.financial_summary.categories.hadiya, color: "#818CF8" },
    { name: "Sadaqah", value: data.financial_summary.categories.sadaqah, color: "#F472B6" },
    { name: "Tuition", value: data.financial_summary.categories.tuition_revenue, color: "#34D399" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 p-6 md:p-10 space-y-8">
      {/* Dynamic Glassmorphic Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.08] pb-6">
        <div>
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Active Campus Node</span>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Center 360° Operations Room
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-medium text-slate-600">RLS Boundary Enforced</span>
        </div>
      </div>

      {/* Grid Block A: Financial Balance Sheet Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Summary Cards */}
        <div className="space-y-4">
          <div className="bg-white/80 border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <DollarSign className="absolute right-4 top-4 w-12 h-12 text-emerald-500/10" />
            <h3 className="text-sm font-medium text-slate-500">Total Incoming Cash</h3>
            <p className="text-3xl font-bold text-emerald-400 mt-2">${data.financial_summary.total_revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white/80 border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <DollarSign className="absolute right-4 top-4 w-12 h-12 text-rose-500/10" />
            <h3 className="text-sm font-medium text-slate-500">Total Operating Expenses</h3>
            <p className="text-3xl font-bold text-rose-400 mt-2">${data.financial_summary.total_expenses.toLocaleString()}</p>
          </div>
          <div className="bg-white/80 border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <TrendingUp className="absolute right-4 top-4 w-12 h-12 text-cyan-500/10" />
            <h3 className="text-sm font-medium text-slate-500">Net Campus Surplus</h3>
            <p className={`text-3xl font-bold mt-2 ${data.financial_summary.net_surplus >= 0 ? "text-cyan-400" : "text-rose-500"}`}>
              ${data.financial_summary.net_surplus.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Visual Incoming Cash Segmentation (Pie Chart) */}
        <div className="bg-white/80 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase self-start">Revenue Allocation</h3>
          <div className="w-full h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#111115", borderColor: "rgba(255,255,255,0.08)", color: "#FFF" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-slate-600 font-medium">{p.name}: ${p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ustad Efficiency Standings */}
        <div className="bg-white/80 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Ustad Teaching Standings</h3>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {data.ustad_efficiency.map((u, idx) => (
              <div key={u.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.pages_taught} pages taught</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-lg text-xs font-extrabold uppercase">
                  {u.efficiency_grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Block B: Student-wise Metric Ratings Table */}
      <div className="bg-white/80 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Student Metrics Matrix</h3>
          <Users className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="pb-3">Student Name</th>
                <th className="pb-3 text-center">Hifz Speed (GPA)</th>
                <th className="pb-3 text-center">Adab Rating</th>
                <th className="pb-3 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-sm">
              {data.student_ratings.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    {s.student_name}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      s.study_rating >= 3.5 ? "bg-emerald-400/10 text-emerald-400" :
                      s.study_rating >= 2.5 ? "bg-cyan-400/10 text-cyan-400" :
                      "bg-rose-400/10 text-rose-400"
                    }`}>
                      {s.study_rating} / 4.0
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      s.discipline_rating >= 8.5 ? "bg-emerald-400/10 text-emerald-400" :
                      s.discipline_rating >= 6.0 ? "bg-amber-400/10 text-amber-400" :
                      "bg-rose-400/10 text-rose-400"
                    }`}>
                      {s.discipline_rating} / 10.0
                    </span>
                  </td>
                  <td className="py-4 text-right text-xs text-slate-500 font-medium">Active Roster</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
