"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle, FileText, Lock, Eye, AlertCircle, EyeOff } from "lucide-react";
import { SwipeActionCard } from "./SwipeActionCard";

interface ComplaintItem {
  id: string;
  submitterName: string;
  againstRole: "USTAD" | "NAZIM" | "STUDENT";
  isAnonymous: boolean;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  resolutionNotes?: string;
  createdAt: string;
}

interface PanelProps {
  initialComplaints: ComplaintItem[];
  userRole: "SUPER_ADMIN" | "NAZIM";
  onResolveSubmit: (complaintId: string, notes: string) => Promise<{ success: boolean; error?: string }>;
}

export const ComplaintResolutionAuditPanel: React.FC<PanelProps> = ({
  initialComplaints,
  userRole,
  onResolveSubmit,
}) => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(initialComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !notes.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await onResolveSubmit(selectedComplaint.id, notes);
      if (res.success) {
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === selectedComplaint.id
              ? { ...c, status: "RESOLVED" as const, resolutionNotes: notes }
              : c
          )
        );
        setSelectedComplaint(null);
        setNotes("");
      } else {
        setError(res.error || "Failed to submit resolution note.");
      }
    } catch (err) {
      setError("An unexpected network fault occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 min-h-screen bg-[#0A0F1D] text-white">
      {/* 1. Complaints Inbox List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-semibold tracking-wide">
              {userRole === "SUPER_ADMIN" ? "Global System Complaint Ledger" : "Center Complaint Desk"}
            </h1>
          </div>
          <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-xs rounded-full font-mono text-cyan-400">
            {complaints.length} Records Found
          </span>
        </div>

        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
          {complaints.map((item) => (
            <SwipeActionCard
              key={item.id}
              onSwipeLeft={() => {
                setSelectedComplaint(item);
                setTimeout(() => alert(`Initiate rejection logic for: ${item.title}`), 300);
              }}
              onSwipeRight={() => {
                setSelectedComplaint(item);
                setTimeout(() => alert(`Initiate fast-track approval for: ${item.title}`), 300);
              }}
            >
              <div
                onClick={() => setSelectedComplaint(item)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  selectedComplaint?.id === item.id
                    ? "bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100 fluid-text-base">{item.title}</h3>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
                      <span className="font-mono px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
                        Against: {item.againstRole}
                      </span>
                      <span className="flex items-center space-x-1">
                        {item.isAnonymous ? (
                          <>
                            <EyeOff className="h-3 w-3 text-amber-500" />
                            <span className="text-amber-500 font-medium">Anonymous Submission</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 text-cyan-400" />
                            <span className="text-cyan-400">{item.submitterName}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-full tracking-wider ${
                      item.status === "RESOLVED"
                        ? "bg-emerald-500/10 border border-emerald-500 text-emerald-400"
                        : "bg-rose-500/10 border border-rose-500 text-rose-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </SwipeActionCard>
          ))}
        </div>
      </div>

      {/* 2. Detailed Inspection & Resolution Pane */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 h-fit sticky top-6">
        {selectedComplaint ? (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Complaint Inspector</span>
              <h2 className="text-lg font-bold text-slate-100 mt-1">{selectedComplaint.title}</h2>
              <p className="text-xs text-slate-500 mt-1">Logged on {selectedComplaint.createdAt}</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Description</label>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                {selectedComplaint.description}
              </div>
            </div>

            {selectedComplaint.status === "RESOLVED" ? (
              <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  <span>Audit Resolution Logged</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{selectedComplaint.resolutionNotes}"
                </p>
              </div>
            ) : (
              <form onSubmit={handleResolve} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                    Mandatory Resolution Audit Note
                  </label>
                  <textarea
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write a clear summary detailing how this issue was resolved..."
                    className="w-full h-28 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 placeholder-slate-600"
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/40 p-3 rounded-lg text-rose-400 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  <span>{submitting ? "Writing Resolution..." : "Mark as Resolved"}</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
            <Lock className="h-10 w-10 text-slate-700 mb-3" />
            <p className="text-sm">Select a complaint from the inbox to inspect its details and log resolutions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
