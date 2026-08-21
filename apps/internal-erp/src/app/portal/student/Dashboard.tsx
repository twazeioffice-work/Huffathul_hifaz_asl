"use client";

import React, { useState } from "react";
import { 
  Calendar, CheckSquare, EyeOff, Send, HelpCircle, 
  BookOpen, Star, Sparkles, MessageSquare, ShieldAlert 
} from "lucide-react";

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: "COMPETITION" | "FUNCTION" | "GENERAL";
  eventDate?: string;
}

export interface StudentPortalProps {
  studentName: string;
  rollNumber: string;
  centerName: string;
  sabaqGrade: string;
  sabaqJuz: number;
  sabaqPages: string;
  enabledModules: {
    halqa: boolean;
    namaz: boolean;
    cleanliness: boolean;
    kithab: boolean;
    other_capabilities: boolean;
  };
  notices: NoticeItem[];
  onComplaintSubmit: (data: any) => Promise<{ success: boolean }>;
}

export default function StudentPortalDashboard({
  studentName,
  rollNumber,
  centerName,
  sabaqGrade,
  sabaqJuz,
  sabaqPages,
  enabledModules,
  notices,
  onComplaintSubmit
}: StudentPortalProps) {
  // Complaint Form States
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [againstRole, setAgainstRole] = useState<"USTAD" | "NAZIM" | "STUDENT">("USTAD");
  const [recipient, setRecipient] = useState<"CENTER_ADMIN" | "SUPER_ADMIN">("CENTER_ADMIN");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleComplaintForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onComplaintSubmit({
      title: complaintTitle,
      description: complaintDesc,
      against_role: againstRole,
      recipient,
      is_anonymous: isAnonymous
    });

    if (res.success) {
      setFormSuccess(true);
      setComplaintTitle("");
      setComplaintDesc("");
      setTimeout(() => setFormSuccess(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white p-6 space-y-6">
      {/* 1. Welcoming Masthead */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div>
          <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">{centerName} student portal</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 mt-1">{studentName}</h1>
          <p className="text-xs text-slate-400 mt-1">Roll Number: {rollNumber}</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Current Juz</span>
            <span className="text-sm font-bold text-cyan-400">{sabaqJuz}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Pages</span>
            <span className="text-sm font-bold text-slate-300">{sabaqPages}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Sabaq Grade</span>
            <span className="text-sm font-bold text-emerald-400">{sabaqGrade}</span>
          </div>
        </div>
      </div>

      {/* 2. Core Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE ASSESSMENTS (Allowed by Center Admin Settings) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>My Assessment Deck</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dynamic Assessment: Halqa Tracking */}
              {enabledModules.halqa && (
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Halqa Attendance</span>
                    <span className="text-xs font-mono text-emerald-400">98% Match</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: "98%" }} />
                  </div>
                </div>
              )}

              {/* Dynamic Assessment: Namaz Congregration (Jamaat) */}
              {enabledModules.namaz && (
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Jamaat Attendance</span>
                    <span className="text-xs font-mono text-cyan-400">5/5 Prayers</span>
                  </div>
                  <div className="flex space-x-1 pt-1 justify-between">
                    {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((p) => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Assessment: Cleanliness & Adab */}
              {enabledModules.cleanliness && (
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Cleanliness & Adab Score</span>
                    <span className="text-xs font-bold text-purple-400">9.5/10</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: "95%" }} />
                  </div>
                </div>
              )}

              {/* Dynamic Assessment: Kithab Evaluation */}
              {enabledModules.kithab && (
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Quran & Hadith Comprehension</span>
                    <span className="text-xs font-mono text-amber-400">Excellent</span>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC SECURE COMPLAINT SYSTEM VIEW FOR THE STUDENT */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <span>Secure Grievance Registry</span>
            </h2>

            <form onSubmit={handleComplaintForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Against Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Complaint Target</label>
                  <select
                    value={againstRole}
                    onChange={(e) => setAgainstRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="USTAD">Against My Ustad (Teacher)</option>
                    <option value="NAZIM">Against Center Nazim (Manager)</option>
                    <option value="STUDENT">Against Another Student</option>
                  </select>
                </div>

                {/* 2. Recipient Selector (Where does it route?) */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Routing Recipient</label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="CENTER_ADMIN">Route to Local Center Admin (Nazim)</option>
                    <option value="SUPER_ADMIN">Route Directly to Global Super Admin</option>
                  </select>
                </div>
              </div>

              {/* 3. Title Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono uppercase block">Complaint Subject</label>
                <input
                  required
                  type="text"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  placeholder="Summarize the core concern..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* 4. Description Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono uppercase block">Incident Details</label>
                <textarea
                  required
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Provide precise chronological details to support our auditing logs..."
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* 5. Anonymity Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-4 w-4 text-amber-500" />
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-300 block">Anonymity Veil</span>
                    <span className="text-[9px] text-slate-500 block">Hide identity from local branch operator</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg">
                  Complaint registered successfully in the zero-trust system.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Submit Grievance</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: INTEGRATED NOTICE BOARD */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span>Campus Notice Board</span>
            </h2>

            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {notices.map((notice) => (
                <div key={notice.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                      notice.category === "COMPETITION" 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : notice.category === "FUNCTION"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}>
                      {notice.category}
                    </span>
                    {notice.eventDate && (
                      <span className="text-[10px] text-slate-500 font-mono">{notice.eventDate}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm">{notice.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
