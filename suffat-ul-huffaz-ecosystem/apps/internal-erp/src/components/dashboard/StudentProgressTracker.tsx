"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, ChevronRight, ArrowLeft, Award, BookOpen, 
  User, MapPin, Calendar, Activity, BarChart3, Star
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_CENTERS = [
  { id: "C3", name: "Dubai Overseas Campus", score: 95.2, students: 240 },
  { id: "C1", name: "Calicut HQ (Markaz)", score: 91.8, students: 850 },
  { id: "C2", name: "Mumbai Hifz Academy", score: 88.4, students: 420 },
  { id: "C4", name: "Malappuram Institute", score: 84.7, students: 630 },
].sort((a, b) => b.score - a.score);

const MOCK_STUDENTS: Record<string, any[]> = {
  "C3": [
    { id: "S1", name: "Abdullah Siddiqui", score: 98, para: "Para 28", attendance: "99%", joinDate: "Aug 2024", evaluator: "Ustad Jameel" },
    { id: "S2", name: "Zayd Ahmed", score: 96, para: "Para 15", attendance: "97%", joinDate: "Jan 2025", evaluator: "Qari Abdullah" },
    { id: "S3", name: "Hamza Tariq", score: 92, para: "Para 14", attendance: "92%", joinDate: "Mar 2024", evaluator: "Ustad Jameel" },
    { id: "S4", name: "Muhammad Malik", score: 89, para: "Para 5", attendance: "95%", joinDate: "Sep 2025", evaluator: "Ustad Jameel" },
  ],
  "C1": [
    { id: "S5", name: "Yusuf Khan", score: 97, para: "Para 30", attendance: "100%", joinDate: "Feb 2023", evaluator: "Qari Abdullah" },
    { id: "S6", name: "Ibrahim Ali", score: 90, para: "Para 10", attendance: "88%", joinDate: "Nov 2024", evaluator: "Ustadh Huzaifa" },
  ]
};

// Global Average Calculation
const GLOBAL_AVERAGE = (MOCK_CENTERS.reduce((acc, c) => acc + c.score, 0) / MOCK_CENTERS.length).toFixed(1);

export const StudentProgressTracker = () => {
  const [view, setView] = useState<"global" | "centers" | "students" | "profile">("global");
  const [selectedCenter, setSelectedCenter] = useState<any | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const handleCenterClick = (center: any) => {
    setSelectedCenter(center);
    setView("students");
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setView("profile");
  };

  return (
    <section className="max-w-7xl mx-auto px-8 pt-6 pb-20">
      
      {/* Dynamic Header with Breadcrumbs */}
      <div className="flex items-center space-x-2 mb-6 text-xs font-mono text-[#86868B]">
        <span 
          onClick={() => setView("global")}
          className={`cursor-pointer hover:text-white transition-colors ${view === "global" ? "text-white font-semibold" : ""}`}
        >
          Global Analytics
        </span>
        
        {view !== "global" && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span 
              onClick={() => setView("centers")}
              className={`cursor-pointer hover:text-white transition-colors ${view === "centers" ? "text-white font-semibold" : ""}`}
            >
              Center Rankings
            </span>
          </>
        )}

        {(view === "students" || view === "profile") && selectedCenter && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span 
              onClick={() => setView("students")}
              className={`cursor-pointer hover:text-white transition-colors ${view === "students" ? "text-white font-semibold" : ""}`}
            >
              {selectedCenter.name}
            </span>
          </>
        )}

        {view === "profile" && selectedStudent && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-semibold">
              {selectedStudent.name}
            </span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW: GLOBAL OVERVIEW CHART */}
        {view === "global" && (
          <motion.div
            key="global"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0F0F12] border border-[#2C2C2E]/50 rounded-3xl p-8 hover:border-[#86868B]/40 transition-all cursor-pointer group"
            onClick={() => setView("centers")}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 flex-1">
                <div className="inline-flex items-center space-x-2 bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  <BarChart3 className="h-3 w-3" />
                  <span>Network Wide Hifz Performance</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
                  {GLOBAL_AVERAGE}% <span className="text-lg text-[#86868B] tracking-normal font-mono">Global Avg</span>
                </h2>
                <p className="text-sm text-[#86868B] max-w-md leading-relaxed">
                  Aggregated memorization and Tajweed scoring across all 16 physical campuses. Click to drill down into center-specific performance matrices.
                </p>
              </div>

              {/* Visual Bar Chart Representation */}
              <div className="flex-1 w-full h-48 bg-[#050506] rounded-2xl border border-[#2C2C2E]/40 p-6 flex items-end justify-between gap-2">
                {MOCK_CENTERS.map((c, i) => (
                  <div key={c.id} className="w-1/4 flex flex-col items-center group-hover:scale-[1.02] transition-transform">
                    <div 
                      className="w-full bg-[#0071E3] rounded-t-sm"
                      style={{ height: `${c.score}%`, opacity: 1 - (i * 0.15) }}
                    />
                    <span className="text-[9px] font-mono text-[#86868B] mt-2 truncate w-full text-center">
                      {c.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: CENTER RANKINGS LIST */}
        {view === "centers" && (
          <motion.div
            key="centers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0F0F12] border border-[#2C2C2E]/50 rounded-3xl p-6"
          >
            <div className="mb-6 flex items-center space-x-3">
              <button onClick={() => setView("global")} className="p-1.5 hover:bg-[#1C1C1E] rounded-full text-[#86868B] hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h3 className="text-lg font-semibold text-white">Top Performing Centers</h3>
            </div>
            
            <div className="space-y-3">
              {MOCK_CENTERS.map((center, idx) => (
                <div 
                  key={center.id}
                  onClick={() => handleCenterClick(center)}
                  className="flex items-center justify-between p-4 bg-[#050506] border border-[#2C2C2E]/40 hover:border-[#0071E3]/50 rounded-2xl cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold font-mono text-[#2C2C2E]">#{idx + 1}</span>
                    <div>
                      <h4 className="text-sm font-medium text-white">{center.name}</h4>
                      <p className="text-[10px] text-[#86868B] font-mono mt-0.5">{center.students} Active Students</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-lg font-light text-white font-mono">{center.score}%</span>
                      <p className="text-[9px] text-[#30D158] uppercase tracking-wider font-semibold">Avg Score</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#86868B]" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW: STUDENTS LIST (CENTER SPECIFIC) */}
        {view === "students" && selectedCenter && (
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0F0F12] border border-[#2C2C2E]/50 rounded-3xl p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={() => setView("centers")} className="p-1.5 hover:bg-[#1C1C1E] rounded-full text-[#86868B] hover:text-white transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedCenter.name}</h3>
                  <p className="text-[10px] text-[#86868B] font-mono uppercase tracking-wider">Student Leaderboard</p>
                </div>
              </div>
              <span className="text-2xl font-light text-[#0071E3] font-mono">{selectedCenter.score}% Avg</span>
            </div>

            <div className="space-y-3">
              {(MOCK_STUDENTS[selectedCenter.id] || []).sort((a, b) => b.score - a.score).map((student, idx) => (
                <div 
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className="flex items-center justify-between p-4 bg-[#050506] border border-[#2C2C2E]/40 hover:border-[#30D158]/50 rounded-2xl cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center font-mono text-[10px] text-white">
                      {student.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{student.name}</h4>
                      <p className="text-[10px] text-[#86868B] font-mono mt-0.5">Current Progress: {student.para}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Visual Progress Bar per student */}
                    <div className="hidden sm:block w-32 h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden">
                      <div className="h-full bg-[#30D158]" style={{ width: `${student.score}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white font-mono w-10 text-right">{student.score}%</span>
                    <ChevronRight className="h-4 w-4 text-[#86868B]" />
                  </div>
                </div>
              ))}
              {(!MOCK_STUDENTS[selectedCenter.id] || MOCK_STUDENTS[selectedCenter.id].length === 0) && (
                <div className="text-center p-8 text-[#86868B] text-xs">
                  No telemetry synced for this center yet.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW: STUDENT PROFILE FULL DETAILS */}
        {view === "profile" && selectedStudent && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0F0F12] border border-[#2C2C2E]/50 rounded-3xl p-8 max-w-3xl mx-auto"
          >
            <button 
              onClick={() => setView("students")}
              className="mb-6 p-1.5 hover:bg-[#1C1C1E] rounded-full text-[#86868B] hover:text-white transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Back to {selectedCenter?.name}</span>
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Card Left */}
              <div className="w-full md:w-1/3 space-y-6">
                <div className="aspect-square bg-[#1C1C1E] rounded-3xl border border-[#2C2C2E]/50 flex items-center justify-center">
                  <User className="h-16 w-16 text-[#86868B]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">{selectedStudent.name}</h2>
                  <p className="text-xs text-[#0071E3] font-mono mt-1">{selectedStudent.id} • {selectedCenter?.name}</p>
                </div>
              </div>

              {/* Stats Right */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                
                <div className="bg-[#050506] p-4 rounded-2xl border border-[#2C2C2E]/40">
                  <div className="flex items-center space-x-2 text-[#86868B] mb-2">
                    <Activity className="h-4 w-4 text-[#30D158]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Hifz Score</span>
                  </div>
                  <span className="text-3xl font-light text-white font-mono">{selectedStudent.score}%</span>
                </div>

                <div className="bg-[#050506] p-4 rounded-2xl border border-[#2C2C2E]/40">
                  <div className="flex items-center space-x-2 text-[#86868B] mb-2">
                    <BookOpen className="h-4 w-4 text-[#FF9F0A]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Current Para</span>
                  </div>
                  <span className="text-xl font-medium text-white">{selectedStudent.para}</span>
                </div>

                <div className="bg-[#050506] p-4 rounded-2xl border border-[#2C2C2E]/40">
                  <div className="flex items-center space-x-2 text-[#86868B] mb-2">
                    <Calendar className="h-4 w-4 text-[#0071E3]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Attendance</span>
                  </div>
                  <span className="text-xl font-medium text-white">{selectedStudent.attendance}</span>
                </div>

                <div className="bg-[#050506] p-4 rounded-2xl border border-[#2C2C2E]/40">
                  <div className="flex items-center space-x-2 text-[#86868B] mb-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Evaluator</span>
                  </div>
                  <span className="text-sm font-medium text-white">{selectedStudent.evaluator}</span>
                </div>

              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
};
