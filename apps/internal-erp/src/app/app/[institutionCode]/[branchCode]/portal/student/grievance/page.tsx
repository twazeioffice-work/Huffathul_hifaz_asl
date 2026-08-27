"use client";

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
