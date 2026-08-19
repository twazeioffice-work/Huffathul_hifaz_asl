"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, FileText, CheckCircle2, AlertCircle, Eye, 
  MapPin, Calendar, Camera, Video, ChevronRight, X, Sparkles, ClipboardCheck
} from "lucide-react";

export default function AffiliationAuditCenter() {
  const [activeTab, setActiveTab] = useState<"APPLICANTS" | "ELIGIBILITY" | "INSPECTIONS">("APPLICANTS");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock Multi-tenant Pending Requests list
  const pendingRequests = [
    { 
      id: "AFF-7721", 
      institution: "Jamia Darul Uloom Al-Huda", 
      location: "Hyderabad Campus", 
      principal: "Mufti Ismail Qasmi", 
      students: 180, 
      stage: "SUBMITTED",
      lastUpdated: "2 hours ago"
    },
    { 
      id: "AFF-1092", 
      institution: "Suffat-ul Quran Academy", 
      location: "Sukkur Branch", 
      principal: "Qari Bilal Nadwi", 
      students: 95, 
      stage: "DRAFT",
      lastUpdated: "1 day ago"
    },
    { 
      id: "AFF-8812", 
      institution: "Al-Furqan Islamic Institute", 
      location: "Rawalpindi Campus", 
      principal: "Maulana Tariq Azmi", 
      students: 240, 
      stage: "APPROVED",
      lastUpdated: "Certified ✓"
    }
  ];

  const handleOpenInspector = (req: any) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 p-6 space-y-6">
      {/* Title block */}
      <div className="flex justify-between items-start border-b border-cyan-500/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase block mb-1">
            HQ Governance Portal
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center">
            <ClipboardCheck className="h-6 w-6 mr-2 text-cyan-400" />
            Accreditation & Affiliation Approval Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic document verification, secure media diagnostics, and on-site physical inspector dispatch.
          </p>
        </div>
        <span className="flex items-center space-x-1 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full font-mono">
          <ShieldCheck className="h-3 w-3 mr-1 animate-pulse" /> Security Mesh Online
        </span>
      </div>

      {/* Tabs Menu */}
      <div className="flex space-x-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("APPLICANTS")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-1 ${
            activeTab === "APPLICANTS" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Accreditation Applicants ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("ELIGIBILITY")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-1 ${
            activeTab === "ELIGIBILITY" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Checklist Criteria Registry
        </button>
        <button
          onClick={() => setActiveTab("INSPECTIONS")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-1 ${
            activeTab === "INSPECTIONS" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Physical Field Inspections
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === "APPLICANTS" && (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => handleOpenInspector(req)}
                className="bg-[#0C1236]/60 hover:bg-[#0E153E]/80 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-xl transition-all cursor-pointer flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-950">
                      ID: {req.id}
                    </span>
                    <span className="text-xs text-slate-400">• Last Updated: {req.lastUpdated}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                    {req.institution}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" /> {req.location}</span>
                    <span>Principal: <strong className="text-slate-300">{req.principal}</strong></span>
                    <span>Capacity: <strong className="text-slate-300">{req.students} Students</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full border ${
                    req.stage === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    req.stage === "SUBMITTED" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {req.stage}
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Inspection Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="relative z-10 w-full max-w-2xl bg-[#080B1E] border-l border-cyan-500/20 h-full flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 bg-[#0B0F27] border-b border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                    Affiliation Dossier Verification
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">{selectedRequest.institution}</h2>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Cryptographic Checklist Gates */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1.5 text-cyan-400" />
                    Dynamic Eligibility Checklist (5 Gates)
                  </h4>
                  
                  <div className="space-y-2">
                    {[
                      { key: "REGISTRATION_VERIFIED", title: "Government Trust Registration Registration Certificate", desc: "SHA-256 certificate hashing completed against national NGO database.", status: true },
                      { key: "CURRICULUM_COMPLIANCE", title: "Syllabus Compliance & Hifz Registry Mapping", desc: "Course maps aligned with central board Qirat directives.", status: true },
                      { key: "TEACHER_TAJWEED_CERTIFIED", title: "Tajweed Certification Verification Log", desc: "All local Ustadhs matched to verified Sanad credentials.", status: true },
                      { key: "FACILITY_FIRE_SAFETY", title: "Civil Defense Fire & Emergency Safety Pass", desc: "Dynamic structural inspection compliance certificate.", status: false },
                      { key: "INTERNET_UPLINK_STABLE", title: "Stable Network Gateway Configuration", desc: "Required local WAN/LAN lines verified for LMS sync.", status: false }
                    ].map((item) => (
                      <div 
                        key={item.key}
                        className={`p-3 rounded-lg border flex items-start justify-between ${
                          item.status ? "bg-emerald-950/20 border-emerald-500/25" : "bg-slate-900/60 border-slate-800"
                        }`}
                      >
                        <div className="pr-4">
                          <h5 className="text-xs font-semibold text-white">{item.title}</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          item.status ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {item.status ? "VERIFIED" : "PENDING"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Media Verification Vault (Photos & Videos) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                    <Camera className="h-4 w-4 mr-1.5 text-cyan-400" />
                    Physical Facility Media Verification
                  </h4>
                  <p className="text-xs text-slate-400">
                    High-definition spatial layout verification prior to deploying physical board inspectors.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Media Item 1 */}
                    <div className="border border-slate-800 rounded-lg p-3 bg-[#0A0F2B] hover:border-cyan-500/30 transition-all">
                      <div className="aspect-video bg-slate-950 rounded flex items-center justify-center border border-slate-900 relative group overflow-hidden">
                        <Camera className="h-6 w-6 text-slate-500 group-hover:scale-110 transition-transform" />
                        <span className="absolute bottom-2 left-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                          JPG • 4.2 MB
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-200 mt-2">Classroom Ventilation Map</h5>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Hash: 8f2a1b9c...</p>
                      <div className="flex space-x-2 mt-2">
                        <button className="text-[9px] bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/40 border border-cyan-950 py-1 rounded w-full flex items-center justify-center">
                          <Eye className="h-3 w-3 mr-1" /> View Image
                        </button>
                      </div>
                    </div>

                    {/* Media Item 2 */}
                    <div className="border border-slate-800 rounded-lg p-3 bg-[#0A0F2B] hover:border-cyan-500/30 transition-all">
                      <div className="aspect-video bg-slate-950 rounded flex items-center justify-center border border-slate-900 relative group overflow-hidden">
                        <Video className="h-6 w-6 text-slate-500 group-hover:scale-110 transition-transform" />
                        <span className="absolute bottom-2 left-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                          MP4 • 24.8 MB
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-200 mt-2">Dormitory & Prayer Walk-through</h5>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Hash: 2b9a7c1e...</p>
                      <div className="flex space-x-2 mt-2">
                        <button className="text-[9px] bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/40 border border-cyan-950 py-1 rounded w-full flex items-center justify-center">
                          <Eye className="h-3 w-3 mr-1" /> View Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Physical Inspection Dispatcher */}
                <div className="space-y-3 bg-[#0D1334]/50 border border-cyan-500/10 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Physical Audit Verification Scheduler
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Accreditation cannot be issued entirely on digital uploads. Use this module to dispatch a physical Board inspector with your localized mobile grading rubric.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block uppercase mb-1">Select Inspector</label>
                      <select className="bg-[#080B1E] border border-cyan-500/20 rounded-md w-full p-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-400">
                        <option>Dr. Abdul Rahman (CARES HQ)</option>
                        <option>Qari Abdullah (Hifz Chief Supervisor)</option>
                        <option>Mufti Faisal Khan (Kozhikode Auditor)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block uppercase mb-1">Target Inspection Date</label>
                      <input 
                        type="date" 
                        defaultValue="2026-09-15"
                        className="bg-[#080B1E] border border-cyan-500/20 rounded-md w-full p-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-400 font-mono" 
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer controls */}
              <div className="border-t border-slate-800 bg-[#0B0F27] p-6 flex justify-between space-x-4">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-1/2 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-mono"
                >
                  Close Dossier
                </button>
                <button
                  onClick={() => {
                    alert("Scheduling physical board inspection and dispatching secure notification to inspector mobile console...");
                  }}
                  className="w-1/2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 py-2.5 text-sm font-bold text-slate-950 transition-all font-mono shadow-md shadow-cyan-500/10"
                >
                  Schedule & Dispatch Inspection
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
