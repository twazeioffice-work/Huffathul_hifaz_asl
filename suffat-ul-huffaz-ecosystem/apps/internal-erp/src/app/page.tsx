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
import { StudentProgressTracker } from "@/components/dashboard/StudentProgressTracker";

// ============================================================================
// 1. TYPOGRAPHY & ESTHETIC PALETTE (Apple Design System Ref)
// Background: Deep Obsidian black (#050506) with subtle off-black panels (#0B0B0E)
// Accent Colors: Royal Blue (#0071E3), Apple Emerald (#30D158), Soft Amber (#FF9F0A)
// Text colors: High-contrast pure white (#FFFFFF), Muted silver (#86868B), Secondary (#A1A1A6)
// ============================================================================

export default function AppleEnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState<"ledger" | "fleet" | "affiliations" | "helpdesk" | null>(null);
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
        <div 
          onClick={() => setActiveTab("ledger")}
          className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px] cursor-pointer hover:ring-1 hover:ring-[#0071E3]"
        >
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
            <span className="text-2xl font-light tracking-tight font-mono text-white">â‚¹12.69 Cr</span>
            <span className="text-[9px] text-[#A1A1A6] block mt-0.5">Across 4 asset categories [cite: 225]</span>
          </div>
        </div>

        {/* Bento 2: Active Transport Fleet */}
        <div 
          onClick={() => setActiveTab("fleet")}
          className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px] cursor-pointer hover:ring-1 hover:ring-[#0071E3]"
        >
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
            <span className="text-[9px] text-[#A1A1A6] block mt-0.5">10 Operational â€¢ 2 In Service [cite: 225]</span>
          </div>
        </div>

        {/* Bento 3: Dormitory Bed Capacity */}
        <div 
          onClick={() => setActiveTab("affiliations")}
          className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px] cursor-pointer hover:ring-1 hover:ring-[#0071E3]"
        >
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
        <div 
          onClick={() => setActiveTab("helpdesk")}
          className="relative group overflow-hidden bg-[#0F0F12] border border-[#2C2C2E]/40 hover:border-[#86868B]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between h-[135px] cursor-pointer hover:ring-1 hover:ring-[#0071E3]"
        >
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

      {/* 5. INTERACTIVE POPUP MODAL */}
      <AnimatePresence>
        {activeTab && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0F0F12] border border-[#2C2C2E]/60 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveTab(null)}
                className="absolute top-4 right-4 p-2 text-[#86868B] hover:text-white rounded-full hover:bg-[#1C1C1E] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-center space-y-4 pt-4">
                 <div className="mx-auto h-16 w-16 bg-[#1C1C1E] rounded-2xl border border-[#2C2C2E]/50 flex items-center justify-center mb-4">
                   {activeTab === 'ledger' && <Landmark className="h-8 w-8 text-[#0071E3]" />}
                   {activeTab === 'fleet' && <Layers className="h-8 w-8 text-[#0071E3]" />}
                   {activeTab === 'affiliations' && <Users className="h-8 w-8 text-[#0071E3]" />}
                   {activeTab === 'helpdesk' && <Radio className="h-8 w-8 text-[#0071E3]" />}
                 </div>
                 <h2 className="text-xl font-semibold text-white">
                   {activeTab === 'ledger' && 'Financial Vault Inspector'}
                   {activeTab === 'fleet' && 'Active Transport Fleet'}
                   {activeTab === 'affiliations' && 'Affiliation Approvals'}
                   {activeTab === 'helpdesk' && 'Mesh Infrastructure'}
                 </h2>
                 <p className="text-sm text-[#86868B] leading-relaxed">
                   This module is currently being re-engineered for the Apple-spec ecosystem. Production telemetry routes will be attached in the next sprint.
                 </p>
                 <button 
                   onClick={() => setActiveTab(null)}
                   className="mt-6 w-full py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold transition-colors"
                 >
                   Close Window
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <StudentProgressTracker />

      {/* 6. APPLE COMPLIANCE FOOTER */}
      <footer className="bg-[#050506] border-t border-[#2C2C2E]/40 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-[#86868B] space-y-4 md:space-y-0">
          <div>
            <p>Copyright Â© 2026 Suffat-ul Huffaz Central Board. All rights reserved [cite: 231].</p>
            <p className="mt-1 font-mono text-[9px]">GCP Region: asia-south1 (Mumbai) â€¢ Secure Cluster Isolation [cite: 53, 78].</p>
          </div>
          <div className="flex space-x-4 font-mono">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>â€¢</span>
            <span className="hover:text-white cursor-pointer transition-colors">SLA Monitoring</span>
            <span>â€¢</span>
            <span className="hover:text-white cursor-pointer transition-colors">Zero-Trust Registry</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
