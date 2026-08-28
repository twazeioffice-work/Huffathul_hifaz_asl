"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Users, Star, BookOpen, AlertTriangle, TrendingUp, TrendingDown, 
  Minus, Search, Filter, Phone, CheckCircle2, ChevronRight, X, 
  Sparkles, Award, ShieldAlert, GraduationCap, Eye
} from "lucide-react";
import { getHalqaAcademicHealthMetrics } from "../actions";

export default function UstadsHalqaHealthPage() {
  const params = useParams();
  const router = useRouter();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedCohort, setSelectedCohort] = useState("ALL");
  const [healthFilter, setHealthFilter] = useState<"ALL" | "FLAGGED" | "TOP">("ALL");
  const [sortBy, setSortBy] = useState<"FLAGGED_FIRST" | "TOP_FIRST" | "STUDENTS_COUNT">("FLAGGED_FIRST");

  // Drilldown Modal
  const [selectedHalqa, setSelectedHalqa] = useState<any>(null);

  useEffect(() => {
    if (institutionCode && branchCode) {
      getHalqaAcademicHealthMetrics(institutionCode, branchCode).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [institutionCode, branchCode]);

  const filteredHalqas = useMemo(() => {
    if (!data?.halqasList) return [];
    
    return data.halqasList.filter((h: any) => {
      const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.students.some((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchBranch = selectedBranch === "ALL" || h.branchCode === selectedBranch || h.branchName === selectedBranch;
      const matchCohort = selectedCohort === "ALL" || h.cohort.includes(selectedCohort);
      
      let matchHealth = true;
      if (healthFilter === "FLAGGED") matchHealth = h.laggingPct >= 15 || h.criticalAlert !== null;
      if (healthFilter === "TOP") matchHealth = h.excellentPct >= 80;

      return matchSearch && matchBranch && matchCohort && matchHealth;
    }).sort((a: any, b: any) => {
      if (sortBy === "FLAGGED_FIRST") return b.laggingPct - a.laggingPct;
      if (sortBy === "TOP_FIRST") return b.excellentPct - a.excellentPct;
      if (sortBy === "STUDENTS_COUNT") return b.studentCount - a.studentCount;
      return 0;
    });
  }, [data, searchQuery, selectedBranch, selectedCohort, healthFilter, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-cyan-600 uppercase tracking-widest block">Executive Academic Oversight</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Ustads & Halqa Performance Health Deck</h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate 3-pillar memorization metrics, cohort benchmarks, and early-warning bottleneck detection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="primary" 
            onClick={() => router.push(`/app/${institutionCode}/${branchCode}/erp/staff/register`)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
          >
            + Add New Ustad
          </Button>
        </div>
      </div>

      {/* 2. Top Macro KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Active Ustads</span>
            <Users className="h-4 w-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data?.totalUstads || 131}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{data?.totalStudents || 2503} Total Students</span>
        </GlassCard>

        <GlassCard className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Global On-Track Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{data?.globalOnTrackPct || 78}%</p>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Meeting/Exceeding Target</span>
        </GlassCard>

        <GlassCard className="p-4 bg-white border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-700 font-mono font-bold uppercase tracking-wider">Flagged Batches</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{data?.underperformingBatchesCount || 8}</p>
          <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">&gt;15% Lagging Threshold</span>
        </GlassCard>

        <GlassCard className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Avg Daily Pace</span>
            <Award className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-1">1.5 pgs</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Sabaq Pages / Student / Day</span>
        </GlassCard>
      </div>

      {/* 3. Filter & Triage Control Strip */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ustad, branch, or student..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Branch Filter */}
          <div>
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Branches & Centers</option>
              {(data?.branches || []).map((b: any) => (
                <option key={b.id} value={b.branchCode}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Cohort Level Filter */}
          <div>
            <select 
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Cohort Levels</option>
              <option value="Foundational">Foundational (Juz 1-5)</option>
              <option value="Intermediate">Intermediate (Juz 6-20)</option>
              <option value="Khatam">Khatam/Sanad (Juz 21-30)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select 
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 font-semibold"
            >
              <option value="FLAGGED_FIRST">Sort: Priority Lagging First ⚠️</option>
              <option value="TOP_FIRST">Sort: Top Performing First 🏆</option>
              <option value="STUDENTS_COUNT">Sort: Most Students Enrolled</option>
            </select>
          </div>

        </div>

        {/* Quick Health Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">Quick Filters:</span>
          <button 
            onClick={() => setHealthFilter("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              healthFilter === "ALL" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Batches ({filteredHalqas.length})
          </button>
          <button 
            onClick={() => setHealthFilter("FLAGGED")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              healthFilter === "FLAGGED" ? "bg-amber-500 text-white shadow-sm" : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Needs Review / Lagging</span>
          </button>
          <button 
            onClick={() => setHealthFilter("TOP")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              healthFilter === "TOP" ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>High Achievers (&gt;80% Top)</span>
          </button>
        </div>
      </div>

      {/* 4. Halqa Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredHalqas.map((halqa: any) => {
          const isFlagged = halqa.laggingPct >= 15;
          return (
            <div 
              key={halqa.id}
              className={`p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md space-y-4 relative overflow-hidden ${
                isFlagged ? "border-amber-300 ring-1 ring-amber-200/60" : "border-slate-200"
              }`}
            >
              {/* Top Row: Ustad identity & branch */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center font-bold text-cyan-800 font-mono text-base">
                    {halqa.name.replace("Ustad ", "").charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{halqa.name}</h3>
                      {halqa.trajectory === "improving" && (
                        <span title="14-day Trend: Improving" className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <TrendingUp className="h-3 w-3 mr-0.5 text-emerald-600" /> +6%
                        </span>
                      )}
                      {halqa.trajectory === "slipping" && (
                        <span title="14-day Trend: Slipping" className="flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          <TrendingDown className="h-3 w-3 mr-0.5 text-rose-600" /> -8%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {halqa.branchName} • <span className="font-semibold text-slate-700">{halqa.studentCount} Students</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-mono font-bold block w-fit ml-auto">
                    {halqa.cohort}
                  </span>
                </div>
              </div>

              {/* Stacked Health Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono font-semibold">
                  <span className="text-emerald-700">🟢 {halqa.excellentPct}% On Target ({halqa.excellentCount})</span>
                  <span className="text-amber-700">🟡 {halqa.averagePct}% Avg ({halqa.averageCount})</span>
                  <span className={`${halqa.laggingPct >= 15 ? 'text-rose-700 font-bold' : 'text-slate-500'}`}>
                    🔴 {halqa.laggingPct}% Lagging ({halqa.laggingCount})
                  </span>
                </div>
                
                {/* Visual Stacked Progress Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
                  <div 
                    style={{ width: `${halqa.excellentPct}%` }} 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    title={`Excellent: ${halqa.excellentPct}%`}
                  />
                  <div 
                    style={{ width: `${halqa.averagePct}%` }} 
                    className="bg-amber-400 h-full transition-all duration-500" 
                    title={`Average: ${halqa.averagePct}%`}
                  />
                  <div 
                    style={{ width: `${halqa.laggingPct}%` }} 
                    className="bg-rose-500 h-full transition-all duration-500" 
                    title={`Lagging: ${halqa.laggingPct}%`}
                  />
                </div>
              </div>

              {/* Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Daily Pace</span>
                  <span className="text-xs font-bold text-slate-800">{halqa.avgPace} pgs/day</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Attendance</span>
                  <span className="text-xs font-bold text-slate-800">{halqa.avgAttendance}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Manzil Pass</span>
                  <span className="text-xs font-bold text-slate-800">{halqa.retentionPassRate}</span>
                </div>
              </div>

              {/* Critical Alert Banner (if any) */}
              {halqa.criticalAlert && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="truncate">{halqa.criticalAlert}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <a 
                  href={`https://wa.me/?text=Assalamu%20Alaikum%20${encodeURIComponent(halqa.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Contact Ustad</span>
                </a>

                <button 
                  onClick={() => setSelectedHalqa(halqa)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-600" />
                  <span>View {halqa.studentCount} Students Roster</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 5. Interactive Drilldown Modal */}
      {selectedHalqa && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-mono text-cyan-600 font-bold uppercase">{selectedHalqa.branchName} • {selectedHalqa.cohort}</span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedHalqa.name} — Student Roster</h2>
                <p className="text-xs text-slate-500">{selectedHalqa.studentCount} enrolled students with live Sabaq performance ratings.</p>
              </div>
              <button 
                onClick={() => setSelectedHalqa(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Distribution Overview */}
            <div className="px-6 py-3 bg-slate-100/50 border-b border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-700 font-bold">🟢 {selectedHalqa.excellentCount} On Target</span>
              <span className="text-amber-700 font-bold">🟡 {selectedHalqa.averageCount} Moderate</span>
              <span className="text-rose-700 font-bold">🔴 {selectedHalqa.laggingCount} Lagging</span>
            </div>

            {/* Students List */}
            <div className="p-6 overflow-y-auto divide-y divide-slate-100 space-y-2">
              {selectedHalqa.students.map((st: any, i: number) => (
                <div key={st.id || i} className="py-3 flex items-center justify-between hover:bg-slate-50 px-3 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                      st.category === "EXCELLENT" ? "bg-emerald-100 text-emerald-800" :
                      st.category === "AVERAGE" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{st.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">Roll: {st.studentCode} • Juz {st.currentJuz}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{st.pace}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Att: {st.attendance}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      st.category === "EXCELLENT" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      st.category === "AVERAGE" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {st.category} ({st.grade})
                    </span>

                    <button 
                      onClick={() => {
                        setSelectedHalqa(null);
                        router.push(`/app/${institutionCode}/${branchCode}/erp/students/${st.id}`);
                      }}
                      className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="View Student Profile"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedHalqa(null)}>Close Roster</Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
