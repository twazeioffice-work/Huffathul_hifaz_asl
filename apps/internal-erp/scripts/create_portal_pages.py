import os

base_portal = r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\app\app\[institutionCode]\[branchCode]\portal"
os.makedirs(os.path.join(base_portal, "student", "progress"), exist_ok=True)
os.makedirs(os.path.join(base_portal, "student", "grievance"), exist_ok=True)
os.makedirs(os.path.join(base_portal, "parent"), exist_ok=True)

progress_code = """\"use client\";

import React, { useState } from "react";
import { BookOpen, CheckCircle2, Star, Award, TrendingUp, Sparkles } from "lucide-react";

export default function StudentProgressPage() {
  const [selectedJuz, setSelectedJuz] = useState(15);

  const juzList = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    status: i < 14 ? "COMPLETED" : i === 14 ? "IN_PROGRESS" : "PENDING",
    pages: 20,
    score: i < 14 ? "A+" : i === 14 ? "A" : "-"
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cyan-600" />
            <span>30 Juz Memorization Pathway</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Interactive tracker for completed, active, and upcoming Para milestones.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold font-mono">
            14 / 30 Juz Completed (46.6%)
          </span>
        </div>
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Quranic Index Deck</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {juzList.map(juz => (
            <button
              key={juz.number}
              onClick={() => setSelectedJuz(juz.number)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                selectedJuz === juz.number
                  ? "border-cyan-500 bg-cyan-50/80 ring-2 ring-cyan-500/20"
                  : juz.status === "COMPLETED"
                  ? "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70"
                  : juz.status === "IN_PROGRESS"
                  ? "border-amber-200 bg-amber-50/40 hover:bg-amber-50/70"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 opacity-60"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-xs font-bold text-slate-700">Juz {juz.number}</span>
                {juz.status === "COMPLETED" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                {juz.status === "IN_PROGRESS" && <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-500">
                  {juz.status === "COMPLETED" ? "Certified" : juz.status === "IN_PROGRESS" ? "Active" : "Upcoming"}
                </span>
                <span className="text-xs font-mono font-bold text-slate-800">Grade: {juz.score}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
"""

grievance_code = """\"use client\";

import React, { useState } from "react";
import { ShieldAlert, Send, EyeOff, CheckCircle2 } from "lucide-react";

export default function StudentGrievancePage() {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [target, setTarget] = useState("USTAD");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSubject("");
    setDetails("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-rose-600" />
          <span>Confidential Grievance Registry</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Directly and securely submit feedback, welfare concerns, or grievances to branch administration.
        </p>
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Grievance Category</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500"
            >
              <option value="USTAD">Academic & Teacher Support</option>
              <option value="HOSTEL">Hostel & Boarding Accommodation</option>
              <option value="KITCHEN">Mess & Food Quality</option>
              <option value="GENERAL">General Welfare Concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Briefly state your concern..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide complete details regarding the matter..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-4 w-4 text-amber-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Anonymity Toggle</span>
                <span className="text-[11px] text-slate-500 block">Withhold your name from center staff</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 accent-cyan-600 cursor-pointer"
            />
          </div>

          {submitted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Your grievance has been safely logged and forwarded for administrative review.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <Send className="h-4 w-4" />
            <span>Submit Grievance</span>
          </button>
        </form>
      </div>
    </div>
  );
}
"""

parent_code = """import React from "react";
import Link from "next/link";
import { Users, Calendar, Award, Phone } from "lucide-react";

export default async function ParentPortalPage({ params }: { params: Promise<{ institutionCode: string; branchCode: string }> }) {
  const { institutionCode, branchCode } = await params;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider">Parent Guardian Portal</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Warder & Guardian Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Live student academic progress and fee transparency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link 
          href={`/app/${institutionCode}/${branchCode}/portal/parent/notices`}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200 flex items-center gap-4"
        >
          <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Campus Announcements</h3>
            <p className="text-xs text-slate-500 mt-0.5">View center notifications, exams, and holidays.</p>
          </div>
        </Link>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Direct Ustad Hotline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Connect with assigned class teacher during office hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(os.path.join(base_portal, 'student', 'progress', 'page.tsx'), 'w', encoding='utf-8') as f:
    f.write(progress_code)

with open(os.path.join(base_portal, 'student', 'grievance', 'page.tsx'), 'w', encoding='utf-8') as f:
    f.write(grievance_code)

with open(os.path.join(base_portal, 'parent', 'page.tsx'), 'w', encoding='utf-8') as f:
    f.write(parent_code)

print("Created portal subpages successfully")
