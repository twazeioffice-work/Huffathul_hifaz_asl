"use client";

import React, { useEffect, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
 * MOCK DATA STORE (Indian Regional Localization)
 * ──────────────────────────────────────────────────────────────────────────── */
const MOCK_STUDENT_DB: Record<string, any> = {
  stud_bilal_101: {
    full_name: "Muhammad Bilal Khan",
    gender: "Male",
    date_of_birth: "2014-03-15",
    blood_group: "B+",
    branch_name: "Bengaluru Main Campus (Jayanagar)",
    target_program: "Hifz-ul-Quran (Para 12)",
    academic_year: "2026-2027",
    batch_name: "Batch Kauthar-A",
    guardian_name: "Ahmed Khan",
    phone: "+91 98450 12345",
    email: "ahmed.khan@gmail.com",
    address: {
      street: "42, 14th Main Road, 4th Block, Jayanagar",
      city: "Bengaluru",
      state: "Karnataka",
      postal_code: "560041",
    },
  },
  stud_abdullah_102: {
    full_name: "Abdullah Siddiqui",
    gender: "Male",
    date_of_birth: "2016-07-22",
    blood_group: "O+",
    branch_name: "Hyderabad Central Branch (Tolichowki)",
    target_program: "Nazra Beginner",
    academic_year: "2026-2027",
    batch_name: "Batch Salsabil-C",
    guardian_name: "Tariq Siddiqui",
    phone: "+91 98480 98765",
    email: "tariq.siddiqui@outlook.com",
    address: {
      street: "Plot 18, Paramount Hills, Tolichowki",
      city: "Hyderabad",
      state: "Telangana",
      postal_code: "500008",
    },
  },
  stud_zainab_103: {
    full_name: "Zainab Fatima",
    gender: "Female",
    date_of_birth: "2015-11-08",
    blood_group: "A+",
    branch_name: "Mumbai Girls Campus (Bandra West)",
    target_program: "Hifz-ul-Quran (Para 5)",
    academic_year: "2026-2027",
    batch_name: "Batch Tasnim-B",
    guardian_name: "Fatima Noor",
    phone: "+91 98200 45678",
    email: null,
    address: {
      street: "12, Hill Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      postal_code: "400050",
    },
  },
};

const MOCK_AFFILIATION_DB: Record<string, any> = {
  aff_darul_uloom_01: {
    academy_name: "Darul Uloom Deoband (Affiliated Academy)",
    principal_name: "Mufti Salman Qasmi",
    student_strength: 450,
    location: "Saharanpur Road, Deoband, Uttar Pradesh - 247554",
  },
  aff_madinah_02: {
    academy_name: "Al-Mahad Al-Aali Al-Islami",
    principal_name: "Dr. Khalid Mehmood Nadwi",
    student_strength: 280,
    location: "Wadi-e-Huda, Shaheen Nagar, Hyderabad, Telangana - 500005",
  },
};

/* ────────────────────────────────────────────────────────────────────────────
 * INLINE SVG ICON COMPONENTS
 * ──────────────────────────────────────────────────────────────────────────── */
function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function IconAlert({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * APPROVAL INSPECTOR DRAWER
 * ──────────────────────────────────────────────────────────────────────────── */
interface ApprovalInspectorDrawerProps {
  isOpen: boolean;
  itemId: string | null;
  type:
    | "student_admission"
    | "affiliation_request"
    | "report_audit"
    | "asset_registration"
    | null;
  onClose: () => void;
  onApproveSuccess?: (id: string) => void;
}

export default function ApprovalInspectorDrawer({
  isOpen,
  itemId,
  type,
  onClose,
  onApproveSuccess,
}: ApprovalInspectorDrawerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  // Simulated API fetch with Indian mock data
  useEffect(() => {
    if (!isOpen || !itemId || !type) return;

    setLoading(true);
    setError(null);
    setData(null);

    const timer = setTimeout(() => {
      try {
        let record: any = null;
        if (type === "student_admission") {
          record = MOCK_STUDENT_DB[itemId];
        } else if (type === "affiliation_request") {
          record = MOCK_AFFILIATION_DB[itemId];
        }

        if (!record) {
          setError("Entity not found in the secure state ledger.");
        } else {
          setData(record);
        }
      } catch {
        setError("An error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isOpen, itemId, type]);

  // Escape key handler (WCAG 2.1 AA)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleApprove = () => {
    if (!itemId || !type) return;
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      if (onApproveSuccess) onApproveSuccess(itemId);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />

      {/* Drawer Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-[#111827] border-l border-[#1E293B] shadow-2xl z-50 flex flex-col text-[#F8FAFC]"
        style={{ animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inspector-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0A0F1D]">
          <div className="flex items-center gap-2">
            <IconShield className="w-5 h-5 text-[#00F0FF]" />
            <h2
              id="inspector-title"
              className="font-semibold text-lg tracking-wide uppercase"
            >
              {type?.replace(/_/g, " ")} Inspector
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#1E293B] transition-colors text-[#94A3B8] hover:text-[#F8FAFC]"
            aria-label="Close panel"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <div className="w-8 h-8 border-2 border-t-transparent border-[#00F0FF] rounded-full animate-spin" />
              <p className="text-[#94A3B8] text-sm animate-pulse">
                Retrieving secure state ledger...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-lg flex items-start gap-3">
              <IconAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium text-sm">System Error</p>
                <p className="text-red-300 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && data && (
            <div className="space-y-6">
              {/* ── Student Admission View ── */}
              {type === "student_admission" && (
                <>
                  {/* Demographic Profile */}
                  <div className="bg-[#1F2937]/50 p-4 border border-[#1E293B] rounded-lg space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#1E293B] pb-2">
                      <IconUser className="w-5 h-5 text-[#00F0FF]" />
                      <span className="font-semibold text-sm uppercase text-[#00F0FF] tracking-wider">
                        Demographic Profile
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Full Name</span>
                        <span className="font-medium text-[#F8FAFC]">{data.full_name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Gender</span>
                        <span className="font-medium text-[#F8FAFC] uppercase">{data.gender}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Date of Birth</span>
                        <span className="font-medium text-[#F8FAFC]">{data.date_of_birth}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Blood Group</span>
                        <span className="font-medium text-[#F8FAFC]">{data.blood_group || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Placement Details */}
                  <div className="bg-[#1F2937]/50 p-4 border border-[#1E293B] rounded-lg space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#1E293B] pb-2">
                      <IconBook className="w-5 h-5 text-[#10B981]" />
                      <span className="font-semibold text-sm uppercase text-[#10B981] tracking-wider">
                        Placement Details
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Target Branch</span>
                        <span className="font-medium text-[#F8FAFC]">{data.branch_name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Target Program</span>
                        <span className="font-medium text-emerald-400">{data.target_program}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Academic Year</span>
                        <span className="font-medium text-[#F8FAFC]">{data.academic_year}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#94A3B8] block">Assigned Batch</span>
                        <span className="font-medium text-[#F8FAFC]">{data.batch_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Details */}
                  <div className="bg-[#1F2937]/50 p-4 border border-[#1E293B] rounded-lg space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#1E293B] pb-2">
                      <IconPhone className="w-5 h-5 text-amber-500" />
                      <span className="font-semibold text-sm uppercase text-amber-500 tracking-wider">
                        Guardian Details
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Father/Guardian Name:</span>
                        <span className="font-medium text-[#F8FAFC]">{data.guardian_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Phone Number:</span>
                        <span className="font-medium text-emerald-400 font-mono">{data.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Email Address:</span>
                        <span className="font-medium text-[#F8FAFC]">{data.email || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-[#1F2937]/50 p-4 border border-[#1E293B] rounded-lg space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#1E293B] pb-2">
                      <IconMapPin className="w-5 h-5 text-[#94A3B8]" />
                      <span className="font-semibold text-sm uppercase text-[#94A3B8] tracking-wider">
                        Indian Residential Address
                      </span>
                    </div>
                    <p className="text-sm text-[#F8FAFC] leading-relaxed">
                      {data.address?.street}, {data.address?.city},{" "}
                      {data.address?.state} - <strong className="text-cyan-400">{data.address?.postal_code}</strong>
                    </p>
                  </div>
                </>
              )}

              {/* ── Affiliation View ── */}
              {type === "affiliation_request" && (
                <div className="bg-[#1F2937]/50 p-4 border border-[#1E293B] rounded-lg space-y-3">
                  <div className="flex items-center gap-3 border-b border-[#1E293B] pb-2">
                    <IconBook className="w-5 h-5 text-[#00F0FF]" />
                    <span className="font-semibold text-sm uppercase text-[#00F0FF] tracking-wider">
                      Academy Demographics
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-[#94A3B8] block">Academy Name</span>
                      <span className="font-medium text-[#F8FAFC]">{data.academy_name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#94A3B8] block">Principal / Admin</span>
                      <span className="font-medium text-[#F8FAFC]">{data.principal_name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#94A3B8] block">Student Strength</span>
                      <span className="font-medium text-emerald-400">
                        {data.student_strength} Students
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#94A3B8] block">Campus Location</span>
                      <span className="font-medium text-[#F8FAFC]">{data.location}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#1E293B] bg-[#0A0F1D] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-md border border-[#1E293B] hover:bg-[#1E293B] text-sm font-semibold transition-colors text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            Cancel Inspection
          </button>
          <button
            onClick={handleApprove}
            disabled={loading || error !== null || approving}
            className="flex-1 py-2.5 rounded-md bg-[#10B981] hover:bg-[#059669] disabled:bg-emerald-950 disabled:text-emerald-700 text-[#0A0F1D] disabled:cursor-not-allowed font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {approving ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-[#0A0F1D] rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <IconCheck className="w-4 h-4" />
                <span>Approve &amp; Commit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
