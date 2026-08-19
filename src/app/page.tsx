"use client";

// ============================================================================
// SUFFAT-UL HUFFAZ ERP - ENTERPRISE COMMAND CENTER (APPLE.COM GRADE REDESIGN)
// File: apple-dashboard-redesign-code.tsx
// Design Language: Minimalist, clean, high-contrast, premium typography, spacious
//                  padding, frosted-glass effects, and micro-interactions.
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Database, Landmark, Layers, ChevronRight, X, 
  AlertTriangle, RefreshCw, FileText, Send, Radio, User, MapPin, 
  Activity, ArrowUpRight, DollarSign, Users, Award, ShieldAlert,
  Sliders, MessageSquare, Compass, PhoneCall, Calendar, HelpCircle
} from "lucide-react";

// ============================================================================
// 1. TYPOGRAPHY & ESTHETIC PALETTE (Apple Design System Ref)
// Background: Deep Obsidian black (#050506) with subtle off-black panels (#0B0B0E)
// Accent Colors: Royal Blue (#0071E3), Apple Emerald (#30D158), Soft Amber (#FF9F0A)
// Text colors: High-contrast pure white (#FFFFFF), Muted silver (#86868B), Secondary (#A1A1A6)
// ============================================================================

export default function AppleEnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState<"ledger" | "fleet" | "affiliations" | "helpdesk">("ledger");
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Sync simulation handler
  const triggerGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#FFFFFF] font-sans antialiased selection:bg-[#0071E3]/30 selection:text-white">
      
      {/* 1. APPLE-STYLE FROSTED NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-[#050506]/70 backdrop-blur-md border-b border-[#2C2C2E]/40 px-6 h-12 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer group">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-[#0071E3] to-[#54A3FF] flex items-center justify-center shadow-lg shadow-[#0071E3]/25 transition-transform duration-300 group-hover:scale-105">
              <span className="text-[11px] font-black tracking-tight text-white font-mono">S</span>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#F5F5F7] group-hover:text-white transition-colors">
              Suffat-ul Huffaz
            </span>
            <span className="text-[9px] bg-[#2C2C2E]/60 text-[#86868B] px-1.5 py-0.5 rounded-full border border-[#2C2C2E]/30 font-mono">
              v2.4-Prod
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-[11px] font-medium text-[#86868B] tracking-tight">
            <span className="text-white cursor-pointer transition-colors hover:text-white">Command Center</span>
            <span className="cursor-pointer transition-colors hover:text-white" onClick={() => setActiveTab("helpdesk")}>Omnichannel Gateway</span>
            <span className="cursor-pointer transition-colors hover:text-white" onClick={() => setActiveTab("fleet")}>Assets & Fleet</span>
            <span className="cursor-pointer transition-colors hover:text-white">Analytics Hub</span>
            <span className="cursor-pointer transition-colors hover:text-white" onClick={() => setActiveTab("affiliations")}>Community Network</span>
          </div>
        </div>

        {/* Right Action Widgets */}
        <div className="flex items-center space-x-4">
          {/* Tenant Status */}
          <div className="hidden sm:flex items-center space-x-2 text-[10px] bg-[#1C1C1E]/60 border border-[#2C2C2E]/50 px-3 py-1 rounded-full font-mono text-[#F5F5F7]">
            <div className="h-1.5 w-1.5 rounded-full bg-[#30D158] animate-pulse" />
            <span className="text-[#A1A1A6]">Active Tenant:</span>
            <span className="font-semibold text-white">suffat-hq</span>
          </div>

          {/* Sync Trigger Button */}
          <button 
            onClick={triggerGlobalSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 bg-white text-black hover:bg-[#F5F5F7] disabled:opacity-50 text-[10px] font-semibold px-3 py-1 rounded-full transition-all active:scale-95 duration-200 shadow-md font-mono"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Mesh"}</span>
          </button>
        </div>
      </nav>

      {/* 2. HERO METRIC AREA (Apple-style expansive typography) */}
      <header className="max-w-7xl mx-auto px-8 pt-12 pb-6 space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0071E3] font-mono">
          HQ Governance Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#F5F5F7] leading-tight">
          System Overview. <span className="font-medium text-white">Audited, real-time, resilient.</span>
        </h1>
        <p className="text-xs text-[#86868B] max-w-2xl font-normal leading-relaxed">
          Integrating 16 physical campuses inside a unified multi-tenant database vault [cite: 236]. Monitored continuously via serverless telemetry sinks and cryptographic ledger checkpoints [cite: 123, 147].
        </p>
      </header>

      {/* 3. BENTO GRID OF CORE PORTFOLIO METRICS (Visual Cleanliness & Space) */}
      <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-4">
        
        {/* Bento 1: Total Portfolio Value */}
        <div className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px]">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-[#1C1C1E]/80 border border-[#2C2C2E]/50 flex items-center justify-center">
              <Landmark className="h-4 w-4 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
            </div>
            <span className="text-[9px] bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20 px-2 py-0.5 rounded-full font-mono font-medium">
              Live Audited
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-[#86868B] block uppercase tracking-wider font-semibold">Total Portfolio Value</span>
            <span className="text-2xl font-light tracking-tight font-mono text-white">₹12.69 Cr</span>
            <span className="text-[9px] text-[#A1A1A6] block mt-0.5">Across 4 asset categories [cite: 225]</span>
          </div>
        </div>

        {/* Bento 2: Active Transport Fleet */}
        <div className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px]">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-[#1C1C1E]/80 border border-[#2C2C2E]/50 flex items-center justify-center">
              <Layers className="h-4 w-4 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
            </div>
            <span className="text-[9px] bg-[#0071E3]/10 text-[#54A3FF] border border-[#0071E3]/20 px-2 py-0.5 rounded-full font-mono font-medium">
              32 Active
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-[#86868B] block uppercase tracking-wider font-semibold">Active Fleet Logs</span>
            <span className="text-2xl font-light tracking-tight font-mono text-white">12 Vehicles</span>
            <span className="text-[9px] text-[#A1A1A6] block mt-0.5">10 Operational • 2 In Service [cite: 225]</span>
          </div>
        </div>

        {/* Bento 3: Dormitory Bed Capacity */}
        <div className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px]">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-[#1C1C1E]/80 border border-[#2C2C2E]/50 flex items-center justify-center">
              <Users className="h-4 w-4 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
            </div>
            <span className="text-[9px] bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/20 px-2 py-0.5 rounded-full font-mono font-medium">
              94% Capacity
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-[#86868B] block uppercase tracking-wider font-semibold">Dormitory Bed Allocations</span>
            <span className="text-2xl font-light tracking-tight font-mono text-white">150 / 160 Beds</span>
            <span className="text-[9px] text-[#A1A1A6] block mt-0.5">Residences fully occupied [cite: 225]</span>
          </div>
        </div>

        {/* Bento 4: Active Edge Nodes */}
        <div className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px]">
          <div className="flex justify-between items-start">
            <div className="h-8 w-8 rounded-lg bg-[#1C1C1E]/80 border border-[#2C2C2E]/50 flex items-center justify-center">
              <Radio className="h-4 w-4 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
              3 Nodes Online
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-[#86868B] block uppercase tracking-wider font-semibold">Mesh Infrastructure</span>
            <span className="text-2xl font-light tracking-tight font-mono text-white">3 Online</span>
            <span className="text-[9px] text-[#A1A1A6] block mt-0.5">Operating with IPSec sync [cite: 227]</span>
          </div>
        </div>

      </section>

      {/* 4. MODULE SWAP NAVIGATION (Apple Segmented Slider Control) */}
      <section className="max-w-7xl mx-auto px-8 pt-8 pb-4">
        <div className="flex border-b border-[#2C2C2E]/40 pb-2 space-x-8 text-xs font-medium tracking-tight text-[#86868B]">
          <button 
            onClick={() => setActiveTab("ledger")}
            className={`pb-2 relative transition-all duration-200 ${activeTab === "ledger" ? "text-white font-semibold" : "hover:text-[#F5F5F7]"}`}
          >
            {activeTab === "ledger" && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0071E3]" />
            )}
            🔐 Financial Vault Inspector
          </button>
          <button 
            onClick={() => setActiveTab("fleet")}
            className={`pb-2 relative transition-all duration-200 ${activeTab === "fleet" ? "text-white font-semibold" : "hover:text-[#F5F5F7]"}`}
          >
            {activeTab === "fleet" && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0071E3]" />
            )}
            🚐 Active Transport Fleet
          </button>
          <button 
            onClick={() => setActiveTab("affiliations")}
            className={`pb-2 relative transition-all duration-200 ${activeTab === "affiliations" ? "text-white font-semibold" : "hover:text-[#F5F5F7]"}`}
          >
            {activeTab === "affiliations" && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0071E3]" />
            )}
            🎓 Affiliation Approvals
          </button>
          <button 
            onClick={() => setActiveTab("helpdesk")}
            className={`pb-2 relative transition-all duration-200 ${activeTab === "helpdesk" ? "text-white font-semibold" : "hover:text-[#F5F5F7]"}`}
          >
            {activeTab === "helpdesk" && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0071E3]" />
            )}
            💬 Omnichannel Helpdesk
          </button>
        </div>
      </section>

      {/* 5. INTERACTIVE CONTENT ZONE (Dynamic Modules with Crisp Layouts) */}
      <main className="max-w-7xl mx-auto px-8 pb-20">
        
        {/* TAB A: DOUBLE-ENTRY FINANCIAL VAULT */}
        {activeTab === "ledger" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* Ledger Listing (Left pane) */}
            <div className="lg:col-span-2 space-y-4 bg-[#0F0F12] border border-[#2C2C2E]/40 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">Recent Cryptographic Ledger Entries</h3>
                  <p className="text-[10px] text-[#86868B] font-mono mt-0.5">Click rows to open SHA-256 cryptographic trail [cite: 123].</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#30D158] bg-[#30D158]/10 border border-[#30D158]/20 px-2 py-0.5 rounded-full font-mono">
                    Balanced: 100% Equilibrium
                  </span>
                </div>
              </div>

              {/* Minimalist Interactive Ledger list */}
              <div className="space-y-2 font-mono text-xs">
                {[
                  { id: "TX-8921", desc: "Student Fee (Gulshan) -> +$350.00 [DEBIT] | Cash Vault -> +$350.00 [CREDIT]", balance: "₹28,500.00", status: "Balanced" },
                  { id: "TX-8922", desc: "Teacher Honorarium -> -$800.00 [CREDIT] | Payroll Acct -> +$800.00 [DEBIT]", balance: "₹65,000.00", status: "Balanced" },
                  { id: "TX-8923", desc: "Campus Solar Maintenance -> -$450.00 [CREDIT] | Facility Ops -> +$450.00 [DEBIT]", balance: "₹36,500.00", status: "Balanced" },
                  { id: "TX-8924", desc: "Hostel Furniture Appraisal -> +$1,200.00 [DEBIT] | Fixed Assets -> +$1,200.00", balance: "₹98,000.00", status: "Balanced" }
                ].map((row) => (
                  <div 
                    key={row.id}
                    onClick={() => setSelectedRecordId(row.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      selectedRecordId === row.id 
                        ? "bg-[#1C1C1E] border-[#0071E3] shadow-md shadow-[#0071E3]/5" 
                        : "bg-[#050506] border-[#2C2C2E]/30 hover:border-[#86868B]/40"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#0071E3] font-semibold">{row.id}</span>
                        <span className="h-1 w-1 bg-[#2C2C2E] rounded-full" />
                        <span className="text-[10px] text-[#A1A1A6] truncate block max-w-sm md:max-w-md">
                          {row.desc}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[11px] font-bold text-white block">{row.balance}</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Audit Panel (Right pane) */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {selectedRecordId ? (
                  <motion.div 
                    key={selectedRecordId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#0F0F12] border border-[#2C2C2E]/40 p-6 rounded-2xl space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold tracking-wider uppercase text-[#86868B] font-mono">
                        Ledger Verification Panel
                      </h4>
                      <button 
                        onClick={() => setSelectedRecordId(null)}
                        className="rounded-full p-1 bg-[#1C1C1E] text-[#86868B] hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] text-[#86868B] block font-mono">Ledger Node ID</span>
                        <span className="text-base font-medium text-white">{selectedRecordId}</span>
                      </div>

                      <div className="bg-[#050506] p-4 rounded-xl border border-[#2C2C2E]/30 font-mono text-[10px] space-y-3">
                        <div className="flex justify-between items-center text-[#86868B]">
                          <span>Verification Protocol:</span>
                          <span className="text-[#30D158] font-bold">LOCKED ✓</span>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[#0071E3] block">SHA-256 Block Signature:</span>
                          <p className="truncate text-white bg-[#1C1C1E] px-2 py-1 rounded">
                            8f7e2a4b9c1d0e8f7a65c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[#0071E3] block">Ed25519 Authority Key:</span>
                          <p className="truncate text-white bg-[#1C1C1E] px-2 py-1 rounded">
                            MEQCIDZ/bW0rRExK1uXgGg2eLqFpB4U8Xb9sD9TzWzL5F9N8AiAt9ZgQ7vK8x4mY3rT2pWqNs
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-[#86868B] block font-mono">Audit Log Trace</span>
                        <div className="text-[11px] text-[#A1A1A6] space-y-2 bg-[#050506] p-4 rounded-xl border border-[#2C2C2E]/30">
                          <p>• Auth ID: <span className="text-white font-mono">user_finance_882</span></p>
                          <p>• Action: <span className="text-[#30D158] font-mono">FEE.COLLECT_SUCCESS</span></p>
                          <p>• IP Source: <span className="text-white font-mono">10.240.18.94</span></p>
                          <p>• Timestamp: <span className="text-[#86868B] font-mono">2026-08-19 11:47:00</span></p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert("Verification ticket exported successfully!")}
                      className="w-full py-2.5 bg-white text-black hover:bg-[#F5F5F7] text-xs font-semibold rounded-xl transition-all font-mono"
                    >
                      Export Verification Ticket
                    </button>
                  </motion.div>
                ) : (
                  <div className="bg-[#0F0F12]/40 border border-dashed border-[#2C2C2E]/40 p-8 rounded-2xl text-center text-[#86868B]">
                    <ShieldCheck className="h-8 w-8 mx-auto text-[#2C2C2E] mb-3" />
                    <p className="text-xs font-normal">Select a ledger entry from the register to audit cryptographically in real-time [cite: 123].</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* TAB B: ACTIVE TRANSPORT FLEET */}
        {activeTab === "fleet" && (
          <div className="bg-[#0F0F12] border border-[#2C2C2E]/40 p-6 rounded-2xl space-y-6 animate-fade-in">
            <div className="flex justify-between items-start border-b border-[#2C2C2E]/30 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Active Transport Fleet Inspector</h3>
                <p className="text-xs text-[#86868B] mt-0.5">Real-time maintenance logs, fuel accounting, and regulatory RTO metrics [cite: 224].</p>
              </div>
              <span className="text-[9px] text-[#86868B] bg-[#1C1C1E]/80 border border-[#2C2C2E]/50 px-3 py-1 rounded-full font-mono">
                GPS Tracker Bypassed
              </span>
            </div>

            {/* Transport Table (High density, spacious) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2C2C2E]/30 text-[#86868B] pb-2">
                    <th className="py-3 font-semibold">Vehicle ID</th>
                    <th className="py-3 font-semibold">Specification</th>
                    <th className="py-3 font-semibold">Maintenance (YTD)</th>
                    <th className="py-3 font-semibold">Fuel Logs</th>
                    <th className="py-3 font-semibold">Insurance Gate</th>
                    <th className="py-3 font-semibold">RTO Register</th>
                    <th className="py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2C2E]/20 text-[#A1A1A6]">
                  {[
                    { tag: "KL-01-CB-8801", name: "Tata Winger 15S", type: "VEH-KL-128", maint: "₹42,350", fuel: "280 Liters", ins: "12 Oct 2026", rto: "FC-Verified", status: "OPERATIONAL", color: "text-[#30D158]" },
                    { tag: "UP-16-AT-9022", name: "Force Traveller 3050", type: "VEH-UP-402", maint: "₹58,900", fuel: "310 Liters", ins: "02 Sep 2026", rto: "FC-Pending", status: "MAINTENANCE", color: "text-[#FF9F0A]" },
                    { tag: "KL-04-TR-1102", name: "Toyota Coaster 24S", type: "VEH-KL-501", maint: "₹18,200", fuel: "420 Liters", ins: "15 Dec 2026", rto: "FC-Verified", status: "OPERATIONAL", color: "text-[#30D158]" }
                  ].map((vh) => (
                    <tr key={vh.tag} className="hover:bg-[#1C1C1E]/30 transition-colors">
                      <td className="py-4 text-[#0071E3] font-semibold">{vh.tag}</td>
                      <td className="py-4 font-sans">
                        <span className="text-white block font-medium">{vh.name}</span>
                        <span className="text-[10px] text-[#86868B] block mt-0.5">{vh.type}</span>
                      </td>
                      <td className="py-4 text-white">{vh.maint}</td>
                      <td className="py-4 text-white">{vh.fuel}</td>
                      <td className="py-4">{vh.ins}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-mono ${
                          vh.rto === "FC-Verified" ? "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/20" : "bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/20"
                        }`}>
                          {vh.rto}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[10px] font-bold ${vh.color}`}>
                          {vh.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB C: AFFILIATION APPROVALS */}
        {activeTab === "affiliations" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            
            {/* Accreditation approvals registry */}
            <div className="lg:col-span-2 space-y-4 bg-[#0F0F12] border border-[#2C2C2E]/40 p-6 rounded-2xl">
              <div>
                <h3 className="text-sm font-semibold text-white">Institutional Affiliation Approvals</h3>
                <p className="text-[10px] text-[#86868B] mt-0.5 font-mono">Central Board accreditation workflow and compliance auditing [cite: 230].</p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: "Jamia Darul Uloom Al-Huda", branch: "Hyderabad Campus", principal: "Mufti Ismail", students: "180 Students", status: "PENDING", bg: "bg-[#FF9F0A]/10 border-[#FF9F0A]/30 text-[#FF9F0A]" },
                  { name: "Suffat-ul Quran Academy", branch: "Kozhikode, Kerala", principal: "Qari Bilal", students: "95 Students", status: "PENDING", bg: "bg-[#FF9F0A]/10 border-[#FF9F0A]/30 text-[#FF9F0A]" },
                  { name: "Al-Furqan Islamic Institute", branch: "Rawalpindi Node", principal: "Maulana Tariq", students: "240 Students", status: "APPROVED", bg: "bg-[#30D158]/10 border-[#30D158]/30 text-[#30D158]" }
                ].map((af, i) => (
                  <div key={i} className="p-4 bg-[#050506] border border-[#2C2C2E]/30 rounded-xl flex items-center justify-between hover:border-[#86868B]/40 transition-colors">
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-sans font-medium text-sm">{af.name}</span>
                        <span className="h-1 w-1 bg-[#2C2C2E] rounded-full" />
                        <span className="text-[10px] text-[#86868B]">{af.branch}</span>
                      </div>
                      <div className="text-[10px] text-[#86868B] font-sans">
                        Principal: <span className="text-white font-medium">{af.principal}</span> • Capacity: <span className="text-[#0071E3] font-bold font-mono">{af.students}</span>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold font-mono ${af.bg}`}>
                        {af.status}
                      </span>
                      {af.status === "PENDING" && (
                        <div className="flex space-x-1.5">
                          <button 
                            onClick={() => alert("Affiliation Approved on secure registry Ledger.")}
                            className="bg-white text-black hover:bg-[#F5F5F7] text-[10px] font-bold px-2 py-1 rounded font-sans transition-all active:scale-95"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standardized Rubric Announcement */}
            <div className="bg-[#0F0F12] border border-[#2C2C2E]/40 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-[#86868B] font-mono flex items-center">
                <Compass className="h-4 w-4 mr-2 text-[#0071E3]" /> Academic Board Announcements
              </h4>

              <div className="bg-[#050506] p-4 rounded-xl border border-[#2C2C2E]/30 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#A1A1A6]">Dr. Abdul Rahman</span>
                  <span className="text-[#86868B]">2 hours ago</span>
                </div>
                <h5 className="text-xs font-medium text-white leading-snug">
                  Standardized Sabaq Evaluation Rubric 2026 [cite: 230]
                </h5>
                <p className="text-[10px] text-[#86868B] leading-relaxed">
                  All affiliated branches are requested to download the updated Tajweed certification guidelines from the reports portal [cite: 231].
                </p>
                <button className="flex items-center space-x-1.5 text-[10px] font-semibold text-[#0071E3] hover:text-[#54A3FF] transition-colors font-mono">
                  <FileText className="h-3 w-3" />
                  <span>Download Guidelines (PDF)</span>
                </button>
              </div>

              <div className="bg-[#050506] p-4 rounded-xl border border-[#2C2C2E]/30 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#A1A1A6]">Qari Abdullah</span>
                  <span className="text-[#86868B]">1 day ago</span>
                </div>
                <h5 className="text-xs font-medium text-white leading-snug">
                  Annual Hifz Competition Date Announcement [cite: 231]
                </h5>
                <p className="text-[10px] text-[#86868B] leading-relaxed">
                  The inter-campus Qirat and Hifz testbed competition will commence on the 15th of next month InshaAllah [cite: 231].
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB D: OMNICHANNEL HELPDESK */}
        {activeTab === "helpdesk" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* Thread Select Panel (Left Pane) */}
            <div className="bg-[#0F0F12] border border-[#2C2C2E]/40 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Active Channels</h3>
                <p className="text-[10px] text-[#86868B] mt-0.5 font-mono">WhatsApp Cloud API v19.0 [cite: 232]</p>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Br. Tariq Mehmood (Parent)", lastMsg: "Assalamoalaikum, Hamza had...", time: "08:15 AM", student: "Hamza Tariq (Para 14)" },
                  { name: "Sr. Maryam Siddiqui (Mother)", lastMsg: "Walaikum Assalam. Your fee...", time: "09:32 AM", student: "Zayd Siddiqui (Para 3)" },
                  { name: "Ustadh Huzaifa (Teacher)", lastMsg: "Alhamdulillah submitted 18...", time: "10:15 AM", student: "Hifz Class Halqa B" }
                ].map((th, i) => (
                  <div key={i} className="p-3 bg-[#050506] border border-[#2C2C2E]/30 hover:border-[#86868B]/40 rounded-xl cursor-pointer transition-colors space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-white font-sans font-medium">{th.name}</span>
                      <span className="text-[#86868B]">{th.time}</span>
                    </div>
                    <p className="text-[10px] text-[#86868B] truncate block">{th.lastMsg}</p>
                    <div className="text-[9px] bg-[#1C1C1E] text-[#0071E3] px-2 py-0.5 rounded border border-[#2C2C2E]/20 inline-block font-mono">
                      {th.student}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Sandbox viewport (Center-Right Pane) */}
            <div className="lg:col-span-2 bg-[#0F0F12] border border-[#2C2C2E]/40 rounded-2xl flex flex-col h-[400px]">
              {/* Active Conversation Header */}
              <div className="p-4 border-b border-[#2C2C2E]/30 bg-[#050506]/40 rounded-t-2xl flex justify-between items-center px-6">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-[#30D158]" />
                  <div>
                    <h4 className="text-xs font-semibold text-white font-sans">Br. Tariq Mehmood (Parent)</h4>
                    <span className="text-[9px] text-[#86868B] font-mono font-medium">+92 300 1234567 • Student: Hamza Tariq (Para 14) [cite: 233]</span>
                  </div>
                </div>
                <span className="text-[9px] bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20 px-2 py-0.5 rounded font-mono font-bold">
                  Online
                </span>
              </div>

              {/* Chat Canvas (Interactive scroll mockup) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs">
                
                {/* Incoming bubble */}
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-[#1C1C1E]/80 border border-[#2C2C2E]/40 p-3 rounded-xl rounded-tl-none">
                    <p className="text-white leading-relaxed">
                      Assalamoalaikum, Hamza had a fever yesterday so he could not attend the morning Sabaq session [cite: 233].
                    </p>
                    <span className="text-[9px] text-[#86868B] block mt-1.5 font-mono text-right">08:15 AM</span>
                  </div>
                </div>

                {/* AI Assistant response */}
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-[#0071E3] p-3 rounded-xl rounded-tr-none text-white shadow-md shadow-[#0071E3]/10">
                    <div className="flex items-center space-x-1.5 mb-1 text-[#F5F5F7] font-semibold text-[9px] font-mono uppercase tracking-wider">
                      <Activity className="h-3 w-3 text-white" />
                      <span>🤖 AI Automation Agent</span>
                    </div>
                    <p className="leading-relaxed">
                      Walaikum Assalam. The AI Assistant has logged a verified Medical Leave in the LMS ledger. JazakAllah khair! [cite: 232, 233]
                    </p>
                    <span className="text-[9px] text-[#F5F5F7]/80 block mt-1.5 font-mono text-right">08:16 AM</span>
                  </div>
                </div>

              </div>

              {/* Action input bar */}
              <div className="p-4 border-t border-[#2C2C2E]/30 bg-[#050506]/40 rounded-b-2xl px-6 flex items-center space-x-3">
                <input 
                  type="text" 
                  placeholder="Draft manually or let AI respond automatically..."
                  className="flex-1 bg-[#050506] border border-[#2C2C2E]/50 rounded-xl px-4 py-2 text-xs text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] transition-colors"
                />
                <button 
                  onClick={() => alert("Message dispatched over secure WhatsApp API.")}
                  className="p-2 bg-white text-black hover:bg-[#F5F5F7] rounded-xl transition-all active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* 6. APPLE COMPLIANCE FOOTER */}
      <footer className="bg-[#050506] border-t border-[#2C2C2E]/40 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-[#86868B] space-y-4 md:space-y-0">
          <div>
            <p>Copyright © 2026 Suffat-ul Huffaz Central Board. All rights reserved [cite: 231].</p>
            <p className="mt-1 font-mono text-[9px]">GCP Region: asia-south1 (Mumbai) • Secure Cluster Isolation [cite: 53, 78].</p>
          </div>
          <div className="flex space-x-4 font-mono">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">SLA Monitoring</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Zero-Trust Registry</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
