"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Calendar, CheckSquare, Eye, Award, Sparkles, 
  ChevronRight, X, AlertTriangle, RefreshCw, FileText, 
  Wifi, WifiOff, Users, Star, CheckCircle, Save, Phone, Lock, Bot
} from "lucide-react";
import { useBrowserSync, type SyncStatusState } from "@/hooks/useBrowserSync";
import { pwaDb, type LocalSabaqDraft, type LocalAttendanceDraft } from "@/db/pwaDb";
import { MemorizationPaceChart } from "@/components/dashboard/MemorizationPaceChart";

// ==============================================================================
// 1. DATA TYPES & PROP INTERFACES
// ==============================================================================

function LiveTimestamp() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="px-4 py-2 font-mono font-medium text-slate-600 text-xs">Loading...</div>;

  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-medium text-slate-600">
      <span className="text-cyan-500 mr-2">●</span>
      {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      <span className="mx-2 text-slate-600">|</span>
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
}

export interface StudentRosterItem {
  id: string; // student_enrollment_id
  name: string;
  rollNumber: string;
  parentPhone: string;
  assignedUstadId: string;
  avatarUrl?: string;
  adabScoreThisWeek: number; // For behavior drawer warnings
}

export interface UstadDashboardProps {
  institutionCode: string;
  branchCode: string;
  ustadName: string;
  halqaName: string;
  sessionToken: string;
  initialRoster: StudentRosterItem[];
}

export type CommandTab = "ATTENDANCE" | "SABAQ" | "SABQI" | "MANZIL" | "ADAB" | "COMMUNICATION";

// ==============================================================================
// 2. MAIN INTEGRATED USTAD DASHBOARD COMPONENT
// ==============================================================================

function UstadDashboardComponent({
  institutionCode,
  branchCode,
  ustadName,
  halqaName,
  sessionToken,
  initialRoster
}: UstadDashboardProps) {
  // --- A. Sync & Storage Engine ---
  const {
    syncStatus,
    lastSyncTime,
    isOnline,
    error: syncError,
    executeSync,
    saveSabaqDraft,
    saveAttendanceDraft
  } = useBrowserSync(branchCode, sessionToken);

  // --- B. State Declarations ---
  const [activeTab, setActiveTab] = useState<CommandTab>("SABAQ");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [roster, setRoster] = useState<StudentRosterItem[]>(initialRoster);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [selectedStudent, setSelectedComplaintStudent] = useState<StudentRosterItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // --- C. Local Roster Input States (Buffered in memory before committing) ---
  const [sabaqBuffer, setSabaqBuffer] = useState<Record<string, {
    juz: number;
    startPage: number;
    endPage: number;
    grade: "MUMTAZ" | "JAYYID" | "MAQBUL" | "DAIF";
    notes: string;
  }>>({});

  const [attendanceBuffer, setAttendanceBuffer] = useState<Record<string, {
    fajr: "PRESENT" | "LATE" | "ABSENT";
    dhuhr: "PRESENT" | "LATE" | "ABSENT";
    asr: "PRESENT" | "LATE" | "ABSENT";
    maghrib: "PRESENT" | "LATE" | "ABSENT";
    isha: "PRESENT" | "LATE" | "ABSENT";
  }>>({});

  const [adabBuffer, setAdabBuffer] = useState<Record<string, number>>({});

  // --- D. Pull Unsynced Counts on Update ---
  const refreshPendingCount = async () => {
    const unsyncedSabaq = await pwaDb.sabaqDrafts.where("synced").equals(0).count();
    const unsyncedAttendance = await pwaDb.attendanceDrafts.where("synced").equals(0).count();
    setPendingCount(unsyncedSabaq + unsyncedAttendance);
  };

  useEffect(() => {
    refreshPendingCount();
    
    // Periodically sync back buffer metrics
    const interval = setInterval(refreshPendingCount, 1500);
    return () => clearInterval(interval);
  }, []);

  // --- E. Load Existing Drafts from Dexie when selectedDate or activeTab shifts ---
  useEffect(() => {
    async function loadDrafts() {
      const loadedSabaq: typeof sabaqBuffer = {};
      const loadedAttendance: typeof attendanceBuffer = {};

      for (const student of roster) {
        // 1. Try loading Hifz Sabaq/Sabqi/Manzil Draft from Dexie
        const sabaqKey = `${student.id}_${activeTab}_${selectedDate}`;
        const existingSabaq = await pwaDb.sabaqDrafts.get(sabaqKey);
        if (existingSabaq) {
          loadedSabaq[student.id] = {
            juz: existingSabaq.juzNumber,
            startPage: existingSabaq.pageStart,
            endPage: existingSabaq.pageEnd,
            grade: existingSabaq.grade,
            notes: existingSabaq.teacherNotes || ""
          };
        } else {
          // Defaults if empty
          loadedSabaq[student.id] = sabaqBuffer[student.id] || {
            juz: 30,
            startPage: 1,
            endPage: 1,
            grade: "MUMTAZ",
            notes: ""
          };
        }

        // 2. Try loading Attendance Draft from Dexie
        const attendanceKey = `${student.id}_${selectedDate}`;
        const existingAttendance = await pwaDb.attendanceDrafts.get(attendanceKey);
        if (existingAttendance) {
          loadedAttendance[student.id] = {
            fajr: existingAttendance.fajr,
            dhuhr: existingAttendance.dhuhr,
            asr: existingAttendance.asr,
            maghrib: existingAttendance.maghrib,
            isha: existingAttendance.isha
          };
        } else {
          // Defaults
          loadedAttendance[student.id] = attendanceBuffer[student.id] || {
            fajr: "ABSENT",
            dhuhr: "ABSENT",
            asr: "ABSENT",
            maghrib: "ABSENT",
            isha: "ABSENT"
          };
        }
      }

      setSabaqBuffer(loadedSabaq);
      setAttendanceBuffer(loadedAttendance);
    }

    loadDrafts();
  }, [selectedDate, activeTab, roster]);

  // --- F. Buffer Mutator Helpers ---
  const updateSabaqField = (studentId: string, field: string, value: any) => {
    setSabaqBuffer(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const cycleAttendance = (studentId: string, prayer: keyof typeof attendanceBuffer[string]) => {
    const cycleStates: Array<"PRESENT" | "LATE" | "ABSENT"> = ["PRESENT", "LATE", "ABSENT"];
    const currentVal = attendanceBuffer[studentId]?.[prayer] || "ABSENT";
    const nextIndex = (cycleStates.indexOf(currentVal) + 1) % cycleStates.length;
    const nextVal = cycleStates[nextIndex];

    setAttendanceBuffer(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [prayer]: nextVal
      }
    }));
  };

  // --- G. Bulk Action Triggers ---
  const markAllPresent = () => {
    const updatedAttendance: typeof attendanceBuffer = {};
    roster.forEach(student => {
      updatedAttendance[student.id] = {
        fajr: "PRESENT",
        dhuhr: "PRESENT",
        asr: "PRESENT",
        maghrib: "PRESENT",
        isha: "PRESENT"
      };
    });
    setAttendanceBuffer(updatedAttendance);
  };

  const handleSaveAndSync = async () => {
    startTransition(async () => {
      // 1. Commit all buffer memory structures back down to Dexie local DB
      for (const student of roster) {
        if (activeTab === "ATTENDANCE") {
          const buffer = attendanceBuffer[student.id];
          if (buffer) {
            await saveAttendanceDraft({
              id: `${student.id}_${selectedDate}`,
              studentEnrollmentId: student.id,
              date: selectedDate,
              fajr: buffer.fajr,
              dhuhr: buffer.dhuhr,
              asr: buffer.asr,
              maghrib: buffer.maghrib,
              isha: buffer.isha
            });
          }
        } else {
          // Sabaq, Sabqi, or Manzil
          const buffer = sabaqBuffer[student.id];
          if (buffer) {
            await saveSabaqDraft({
              id: `${student.id}_${activeTab}_${selectedDate}`,
              studentEnrollmentId: student.id,
              juzNumber: buffer.juz,
              pageStart: buffer.startPage,
              pageEnd: buffer.endPage,
              grade: buffer.grade,
              teacherNotes: buffer.notes
            });
          }
        }
      }

      await refreshPendingCount();

      // 2. Trigger active bidirectional API handshake if online connection exists
      if (isOnline) {
        await executeSync();
        await refreshPendingCount();
      }
    });
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 p-4 md:p-6 pb-24">
      {/* ==============================================================================
          1. GLOBAL NAVIGATION & RUNTIME HEADERS
          ============================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse-glow" />
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">{halqaName}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">{ustadName}</h1>
        </div>

        {/* Sync telemetry, date navigator controls */}
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          {/* Sync Pill */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono select-none transition-all duration-200 ${
            syncStatus === "SYNCED"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : syncStatus === "SYNCING"
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse"
              : syncStatus === "DIRTY"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}>
            {isOnline ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            <span>
              {syncStatus === "SYNCED" && "Synced"}
              {syncStatus === "SYNCING" && "Syncing..."}
              {syncStatus === "DIRTY" && `${pendingCount} Pending Sync`}
              {syncStatus === "OFFLINE" && `${pendingCount} Cached Offline`}
              {syncStatus === "ERROR" && "Sync Failure"}
            </span>
          </div>

          {/* Fixed Timestamp Clock (Ensures strict chronological logging) */}
          <LiveTimestamp />
        </div>
      </div>

      {/* ==============================================================================
          2. USTAD COMMAND STRIP (Tab context routing filters)
          ============================================================================== */}
      <div className="flex overflow-x-auto space-x-2 pb-4 mb-4 scrollbar-hide border-b border-slate-900">
        {[
          { id: "SABAQ", label: "Hifz Sabaq (New)" },
          { id: "SABQI", label: "Sabqi (Recent)" },
          { id: "MANZIL", label: "Manzil (Revision)" },
          { id: "ATTENDANCE", label: "Attendance & Prayers" },
          { id: "ADAB", label: "Adab & Behavior" },
          { id: "COMMUNICATION", label: "WhatsApp Reports" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CommandTab)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                : "bg-white/60 border-slate-200/80 text-slate-500 hover:border-slate-200 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Synchronizer Error banner */}
      {syncError && (
        <div className="flex items-center space-x-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs mb-4">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* ==============================================================================
          3. COMPONENT GRID LIST (Active Smart Roster cards)
          ============================================================================== */}
      <div className="space-y-4">
        {roster.map((student) => {
          const sBuffer = sabaqBuffer[student.id];
          const aBuffer = attendanceBuffer[student.id];

          return (
            <div 
              key={student.id}
              className="bg-white/40 border border-slate-200 rounded-2xl p-4 transition-all duration-200 hover:border-slate-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* A. Student Profile Identity Column */}
                <div 
                  onClick={() => setSelectedComplaintStudent(student)}
                  className="flex items-center space-x-3 cursor-pointer select-none"
                >
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-200/60 flex items-center justify-center font-bold text-cyan-400">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 flex items-center space-x-1.5 hover:text-cyan-400 transition-colors">
                      <span>{student.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </h3>
                    <p className="text-xs text-slate-500">Roll: {student.rollNumber}</p>
                  </div>
                </div>

                {/* B. Dynamic Assessment input block */}
                <div className="flex-1 max-w-xl">
                  {/* TAB 1: SABAQ / SABQI / MANZIL GRIDS */}
                  {activeTab !== "ATTENDANCE" && activeTab !== "ADAB" && sBuffer && (
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      {/* Range Controls */}
                      <div className="flex items-center space-x-2">
                        {/* Juz dropdown selector */}
                        <div className="relative">
                          <select
                            value={sBuffer.juz}
                            onChange={(e) => updateSabaqField(student.id, "juz", parseInt(e.target.value))}
                            className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>Juz {num}</option>
                            ))}
                          </select>
                        </div>

                        {/* Starting/Ending pages */}
                        <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl px-2 py-1">
                          <input
                            type="number"
                            value={sBuffer.startPage}
                            min={1}
                            max={604}
                            onChange={(e) => updateSabaqField(student.id, "startPage", parseInt(e.target.value))}
                            className="w-10 bg-transparent text-center font-mono text-xs focus:outline-none"
                            placeholder="Start"
                          />
                          <span className="text-slate-600 text-xs">➔</span>
                          <input
                            type="number"
                            value={sBuffer.endPage}
                            min={sBuffer.startPage}
                            max={604}
                            onChange={(e) => updateSabaqField(student.id, "endPage", parseInt(e.target.value))}
                            className="w-10 bg-transparent text-center font-mono text-xs focus:outline-none"
                            placeholder="End"
                          />
                        </div>
                      </div>

                      {/* Grading Tap Matrix */}
                      <div className="grid grid-cols-4 gap-1.5 flex-1">
                        {[
                          { key: "MUMTAZ", label: "🟢 Mumtaz", style: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/20 active:bg-emerald-500/10" },
                          { key: "JAYYID", label: "🔵 Jayyid", style: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/20 active:bg-cyan-500/10" },
                          { key: "MAQBUL", label: "🟡 Maqbul", style: "border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/20 active:bg-amber-500/10" },
                          { key: "DAIF", label: "🔴 Da'if", style: "border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/20 active:bg-rose-500/10" }
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            onClick={() => updateSabaqField(student.id, "grade", btn.key)}
                            className={`py-2 text-[10px] font-bold rounded-xl border transition-all duration-150 select-none ${
                              sBuffer.grade === btn.key
                                ? btn.key === "MUMTAZ" ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                  : btn.key === "JAYYID" ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                                  : btn.key === "MAQBUL" ? "bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                                  : "bg-rose-500 border-rose-400 text-slate-950 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                                : btn.style
                            }`}
                          >
                            {btn.label.split(" ")[1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRAYERS ATTENDANCE GRID */}
                  {activeTab === "ATTENDANCE" && aBuffer && (
                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as Array<keyof typeof aBuffer>).map((prayer) => {
                        const status = aBuffer[prayer];
                        return (
                          <button
                            key={prayer}
                            onClick={() => cycleAttendance(student.id, prayer)}
                            className={`flex-1 min-w-[70px] py-2 rounded-xl text-[10px] border font-bold capitalize transition-all duration-150 select-none ${
                              status === "PRESENT"
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                : status === "LATE"
                                ? "bg-amber-500/10 border-amber-500 text-amber-400"
                                : "bg-rose-500/10 border-rose-500 text-rose-400"
                            }`}
                          >
                            <span className="block opacity-60 text-[8px] uppercase font-mono">{prayer}</span>
                            <span className="block mt-0.5">{status}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* TAB 3: ADAB & BEHAVIOR GRID */}
                  {activeTab === "ADAB" && (
                    <div className="flex items-center justify-end space-x-4">
                      <span className="text-xs text-slate-500">Class behavior & adab:</span>
                      <div className="flex space-x-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const currentScore = adabBuffer[student.id] || 5;
                          return (
                            <button
                              key={star}
                              onClick={() => setAdabBuffer(prev => ({ ...prev, [student.id]: star }))}
                              className={`p-1.5 rounded-lg border transition-all duration-150 ${
                                star <= currentScore
                                  ? "bg-amber-500/10 border-amber-500 text-amber-400"
                                  : "bg-white border-slate-200 text-slate-600"
                              }`}
                            >
                              <Star className={`h-4 w-4 ${star <= currentScore ? "fill-current" : ""}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: COMMUNICATION AI DISPATCH */}
                  {activeTab === "COMMUNICATION" && (
                    <div className="flex items-center justify-end space-x-4 w-full">
                      <div className="flex flex-col text-right hidden sm:flex">
                        <span className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">WATI Webhook Active</span>
                        <span className="text-[9px] text-slate-500 font-mono">Gemini 1.5 Flash</span>
                      </div>
                      <button 
                        onClick={() => alert(`Webhook Triggered: Sending Gemini AI progress report to ${student.parentPhone} via WATI.`)}
                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      >
                        <Bot className="h-4 w-4" />
                        <span>Send WhatsApp Report</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsed/Expandable Note Footer */}
              {activeTab !== "ATTENDANCE" && activeTab !== "ADAB" && activeTab !== "COMMUNICATION" && sBuffer && (
                <div className="mt-3 border-t border-slate-900 pt-3 flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 uppercase font-mono select-none">Notes:</span>
                  <input
                    type="text"
                    value={sBuffer.notes}
                    onChange={(e) => updateSabaqField(student.id, "notes", e.target.value)}
                    placeholder="📝 Makharij validation or memorization remarks..."
                    className="flex-1 bg-transparent text-xs text-slate-600 border-b border-transparent hover:border-slate-200 focus:border-cyan-500 focus:outline-none pb-0.5 transition-colors"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ==============================================================================
          4. FLOATING ACTION DOCK
          ============================================================================== */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/[0.08] p-3 rounded-2xl flex items-center justify-between shadow-2xl z-40">
        <button
          onClick={markAllPresent}
          disabled={activeTab !== "ATTENDANCE"}
          className="px-4 py-3 bg-white hover:bg-slate-800 border border-slate-200 text-slate-200 text-xs font-semibold rounded-xl tracking-wide transition-colors flex items-center space-x-1.5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <CheckSquare className="h-4 w-4 text-cyan-400" />
          <span>Mark All Present</span>
        </button>

        <button
          onClick={handleSaveAndSync}
          disabled={isPending}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold rounded-xl tracking-wider transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
        >
          {isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isOnline ? "Save & Sync Drafts" : "Save Offline Draft"}</span>
        </button>
      </div>

      {/* ==============================================================================
          5. SLIDE-OUT DRAWER: STUDENT 360° PROFILE
          ============================================================================== */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            {/* Backdrop lock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaintStudent(null)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Slider Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0E1325] border-l border-slate-200 z-50 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-200 flex items-center justify-center font-bold text-cyan-400">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-100 text-base">{selectedStudent.name}</h2>
                      <p className="text-[10px] text-cyan-400 font-mono tracking-wider">STUDENT PROFILE</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedComplaintStudent(null)}
                    className="p-2 bg-white border border-slate-200 hover:border-slate-200 rounded-xl transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Parent Contact Card */}
                <div className="p-4 bg-white/60 border border-slate-200/80 rounded-xl space-y-4">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Guardian & Emergency Contact</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Father/Guardian Call:</span>
                      <a 
                        href={`tel:${selectedStudent.parentPhone}`} 
                        className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg transition-colors font-mono"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>{selectedStudent.parentPhone}</span>
                      </a>
                    </div>
                  </div>

                  {/* AI WhatsApp Dispatch Button */}
                  <div className="pt-3 border-t border-slate-200/80">
                    <button 
                      onClick={() => alert(`Webhook Triggered: Sending Gemini AI progress report to ${selectedStudent.parentPhone} via WATI.`)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    >
                      <Bot className="h-4 w-4" />
                      <span>Send AI Progress Report</span>
                    </button>
                    <p className="text-[9px] text-center text-slate-500 mt-1.5 font-mono">Powered by Gemini 1.5 Flash</p>
                  </div>
                </div>

                <MemorizationPaceChart />

                {/* Behavioral & Adab Warnings */}
                <div className="p-4 bg-white/60 border border-slate-200/80 rounded-xl space-y-2">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Adab & Cleanliness Score</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Active Score This Week:</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      selectedStudent.adabScoreThisWeek < 3 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {selectedStudent.adabScoreThisWeek} / 5 Stars
                    </span>
                  </div>
                  {selectedStudent.adabScoreThisWeek < 3 && (
                    <div className="flex items-start space-x-2 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-[10px] text-rose-400 mt-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>Warning: Adab scores below 3 stars automatically generate localized parental alerts during Sunday audits.</span>
                    </div>
                  )}
                </div>

                {/* Secure Evaluation Notes */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Staff Evaluation Notes</span>
                    <div className="flex items-center space-x-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-wide">Hidden from Student</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <textarea 
                      placeholder="Write a private evaluation or observation..." 
                      className="w-full h-20 bg-black/50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none"
                    ></textarea>
                    <div className="flex justify-end">
                      <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded-md transition-colors flex items-center space-x-1 shadow-lg shadow-cyan-500/20">
                        <Save className="w-3 h-3" />
                        <span>Save Private Note</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1 mt-4">
                    {[
                      { date: "2026-08-15", author: "Ustad Bilal", text: "Struggling to maintain proper Tajweed over long breath transitions." },
                      { date: "2026-08-01", author: "Ustad Bilal", text: "Excellent concentration during manzil sessions today." }
                    ].map((note, idx) => (
                      <div key={idx} className="p-2.5 bg-white border border-slate-900 rounded-lg text-[10px] space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span className="font-semibold text-cyan-500/80">{note.author}</span>
                          <span className="font-mono text-slate-500">{note.date}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed italic">"{note.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action items in Drawer footer */}
              <div className="pt-4 border-t border-slate-200 mt-6">
                <button 
                  onClick={() => setSelectedComplaintStudent(null)}
                  className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-200 hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-600 transition-colors"
                >
                  Close Profile View
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AcademicsPage() {
  const params = useParams();
  const institutionCode = params.institutionCode as string || "suffat";
  const branchCode = params.branchCode as string || "main";

  // In a production app, these would be fetched securely from a Server Component.
  // We mock them here to instantiate the client component seamlessly.
  const mockRoster: StudentRosterItem[] = [
    { id: "S-1001", name: "Zaid Ibrahim", rollNumber: "H-401", parentPhone: "555-1234", assignedUstadId: "U-1", adabScoreThisWeek: 4 },
    { id: "S-1002", name: "Abdullah Tariq", rollNumber: "H-402", parentPhone: "555-5678", assignedUstadId: "U-1", adabScoreThisWeek: 2 },
    { id: "S-1003", name: "Umar Farooq", rollNumber: "H-403", parentPhone: "555-9012", assignedUstadId: "U-1", adabScoreThisWeek: 5 },
  ];

  return (
    <UstadDashboardComponent
      institutionCode={institutionCode}
      branchCode={branchCode}
      ustadName="Ustad Bilal"
      halqaName="Halqa Abubakar"
      sessionToken="mock_jwt_token"
      initialRoster={mockRoster}
    />
  );
}
