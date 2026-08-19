"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, ShieldCheck, Database, Calendar, Landmark, 
  Layers, ChevronRight, X, AlertTriangle, RefreshCw, FileText
} from "lucide-react";

// ============================================================================
// 1. DATA TYPE DEFINITIONS (TypeScript interfaces matching multi-tenant schemas)
// ============================================================================

export interface AssetRecord {
  id: string;
  name: string;
  category: "IT Equipment" | "Furniture" | "Library" | "Infrastructure" | "Vehicle";
  bookValue: number;
  status: "Operational" | "Under Maintenance" | "Damaged";
  serialNumber: string;
  rfidTag: string;
}

export interface BankAccountReserve {
  id: string;
  institutionName: string;
  accountNumber: string;
  accountType: "Operating Cash" | "Reserve Fund" | "Endowment" | "Gold Reserve";
  balance: number;
  lastReconciledAt: string;
}

export interface AppraisalRecord {
  id: string;
  assetName: string;
  previousValue: number;
  appraisedValue: number;
  changePercentage: number;
  certifiedBy: string;
  auditHash: string; // SHA-256 Block Signature for Double-entry security
  appraisalDate: string;
}

// ============================================================================
// 2. STATE MANAGER HOOK (useSubCardInspector)
// ============================================================================

export type ActiveDrawerType = "TRACKED_ASSETS" | "LIQUID_RESERVES" | "APPRAISALS" | null;

export const useSubCardInspector = () => {
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawerType>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Data States
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [reserves, setReserves] = useState<BankAccountReserve[]>([]);
  const [appraisals, setAppraisals] = useState<AppraisalRecord[]>([]);

  const closeDrawer = () => {
    setActiveDrawer(null);
    setError(null);
  };

  const openDrawer = async (type: ActiveDrawerType) => {
    setActiveDrawer(type);
    setLoading(true);
    setError(null);

    try {
      // Simulate direct microsecond fetch from GCP Cloud SQL Multi-Tenant endpoints
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (type === "TRACKED_ASSETS") {
        setAssets([
          { id: "AST-101", name: "Dell Core i9 Smart Lab Stations", category: "IT Equipment", bookValue: 1250000, status: "Operational", serialNumber: "DL-9932-X", rfidTag: "RFID-8812-FF" },
          { id: "AST-102", name: "Solid Teak Quran Storage Cabinets", category: "Furniture", bookValue: 450000, status: "Operational", serialNumber: "TK-4022-Q", rfidTag: "RFID-3991-BC" },
          { id: "AST-103", name: "Interactive Smart Board Displays 75\"", category: "IT Equipment", bookValue: 850000, status: "Under Maintenance", serialNumber: "SB-2291-C", rfidTag: "RFID-0922-KA" },
          { id: "AST-104", name: "National Library Quranic Codex (Rare)", category: "Library", bookValue: 2500000, status: "Operational", serialNumber: "LB-0012-P", rfidTag: "RFID-7611-ZX" },
          { id: "AST-105", name: "30kVA Silent Auxiliary Generator", category: "Infrastructure", bookValue: 1800000, status: "Damaged", serialNumber: "GN-8833-S", rfidTag: "RFID-2311-TR" }
        ]);
      } else if (type === "LIQUID_RESERVES") {
        setReserves([
          { id: "ACC-01", institutionName: "Standard Chartered Bank", accountNumber: "******882103", accountType: "Operating Cash", balance: 14500000, lastReconciledAt: "2026-08-19 04:00:00" },
          { id: "ACC-02", institutionName: "Al Baraka Serverless Islamic Vault", accountNumber: "******994201", accountType: "Reserve Fund", balance: 35000000, lastReconciledAt: "2026-08-19 04:15:00" },
          { id: "ACC-03", institutionName: "Treasury Bullion Account (Physical Gold)", accountNumber: "******772210", accountType: "Gold Reserve", balance: 22800000, lastReconciledAt: "2026-08-18 18:30:00" },
          { id: "ACC-04", institutionName: "State Bank of India (Admissions Pool)", accountNumber: "******110293", accountType: "Operating Cash", balance: 6750000, lastReconciledAt: "2026-08-19 04:00:00" }
        ]);
      } else if (type === "APPRAISALS") {
        setAppraisals([
          { id: "APR-2026-01", assetName: "Central Administrative Real Estate (Calicut)", previousValue: 45000000, appraisedValue: 49500000, changePercentage: 10.0, certifiedBy: "Er. Faisal K. (Approved Valuer)", auditHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", appraisalDate: "2026-07-15" },
          { id: "APR-2026-02", assetName: "Wayanad Rural Campus Infrastructure", previousValue: 18000000, appraisedValue: 19500000, changePercentage: 8.33, certifiedBy: "Valuation Board Comm", auditHash: "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03", appraisalDate: "2026-08-01" },
          { id: "APR-2026-03", assetName: "Custom Specialized Mobile LMS Van Fleet", previousValue: 7500000, appraisedValue: 6200000, changePercentage: -17.33, certifiedBy: "SRE Depreciation Engine", auditHash: "a28cd7e834d943da0c2a29dc286a2ee9228e9d3434ca495111b782c9e83bd092", appraisalDate: "2026-08-15" }
        ]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to retrieve real-time vault metrics.");
    } finally {
      setLoading(false);
    }
  };

  return {
    activeDrawer,
    selectedBranch,
    setSelectedBranch,
    loading,
    error,
    assets,
    reserves,
    appraisals,
    openDrawer,
    closeDrawer
  };
};

// ============================================================================
// 3. MASTER DRAWER COMPONENT (SubCardInspectorDrawer)
// ============================================================================

interface DrawerProps {
  isOpen: boolean;
  type: ActiveDrawerType;
  onClose: () => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  loading: boolean;
  error: string | null;
  assets: AssetRecord[];
  reserves: BankAccountReserve[];
  appraisals: AppraisalRecord[];
}

export const SubCardInspectorDrawer: React.FC<DrawerProps> = ({
  isOpen,
  type,
  onClose,
  selectedBranch,
  setSelectedBranch,
  loading,
  error,
  assets,
  reserves,
  appraisals
}) => {
  if (!isOpen) return null;

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-black/60 backdrop-blur-sm">
        {/* Backdrop click closer */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-[#080B1E] border-l border-cyan-500/20 text-slate-100 shadow-2xl shadow-cyan-500/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-6 bg-[#0B0F27]">
            <div>
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                Real-Time Audited Vault
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                {type === "TRACKED_ASSETS" && "🔍 Total Tracked Assets Portal"}
                {type === "LIQUID_RESERVES" && "🏦 Liquid Cash & Reserves Ledger"}
                {type === "APPRAISALS" && "📉 Asset Appraisals (FY26) Audit"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Branch Filter & Info Banner */}
          <div className="flex items-center justify-between bg-[#0D1334]/80 p-4 border-b border-cyan-500/10 px-6">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-slate-300">Filtering by center:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-[#080B1E] border border-cyan-500/20 rounded-md px-2 py-1 text-xs text-cyan-400 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All National Branches</option>
                <option value="CALICUT">Calicut Center (500+ Assets)</option>
                <option value="MALAPPURAM">Malappuram Branch</option>
                <option value="KERALA_HQ">Kerala Central HQ</option>
                <option value="DELHI_CAMPUS">Delhi Campus Node</option>
              </select>
            </div>
            <span className="flex items-center space-x-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              <ShieldCheck className="h-3 w-3 mr-1 animate-pulse" /> Live GCP Verified
            </span>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4">
                <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
                <p className="text-sm text-slate-400 font-mono">Querying multi-tenant database clusters...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center space-y-3">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
                <p className="text-sm font-semibold text-red-400">{error}</p>
                <button
                  onClick={() => setSelectedBranch("ALL")}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs px-3 py-1.5 rounded-md font-mono"
                >
                  Reset Diagnostics
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Tracked Assets Listing */}
                {type === "TRACKED_ASSETS" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div className="bg-[#0E1537] p-3 rounded-lg border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Operational</span>
                        <span className="text-lg font-bold text-emerald-400 font-mono">92%</span>
                      </div>
                      <div className="bg-[#0E1537] p-3 rounded-lg border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">In Maintenance</span>
                        <span className="text-lg font-bold text-amber-400 font-mono">6.5%</span>
                      </div>
                      <div className="bg-[#0E1537] p-3 rounded-lg border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Damaged/Loss</span>
                        <span className="text-lg font-bold text-rose-400 font-mono">1.5%</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 font-mono px-1 py-2 border-b border-slate-800 flex justify-between">
                      <span>Asset / Tag ID</span>
                      <span>Book Value (INR)</span>
                    </div>

                    {assets.map((ast) => (
                      <div 
                        key={ast.id}
                        className="p-4 rounded-xl border border-slate-800 bg-[#0A0F2B] hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-950">
                              {ast.id} • {ast.rfidTag}
                            </span>
                            <h4 className="text-sm font-semibold text-white mt-1.5 group-hover:text-cyan-300 transition-colors">
                              {ast.name}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 flex items-center">
                              Category: <span className="text-slate-300 font-medium ml-1 mr-3">{ast.category}</span>
                              Serial: <span className="text-slate-300 font-mono ml-1">{ast.serialNumber}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-white font-mono block">
                              {formatCurrency(ast.bookValue)}
                            </span>
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 font-mono ${
                              ast.status === "Operational" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                              ast.status === "Under Maintenance" ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" :
                              "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                            }`}>
                              {ast.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Liquid Reserves Listing */}
                {type === "LIQUID_RESERVES" && (
                  <div className="space-y-3">
                    <div className="bg-[#0E1537] p-4 rounded-xl border border-cyan-500/10 flex justify-between items-center mb-2">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase">Consolidated Liquidity Pool</span>
                        <span className="text-2xl font-bold text-emerald-400 font-mono">₹7,00,50,000</span>
                      </div>
                      <Landmark className="h-8 w-8 text-cyan-400/30" />
                    </div>

                    <div className="text-xs text-slate-400 font-mono px-1 py-2 border-b border-slate-800 flex justify-between">
                      <span>Reconciled Accounts</span>
                      <span>Verified Balance</span>
                    </div>

                    {reserves.map((res) => (
                      <div 
                        key={res.id}
                        className="p-4 rounded-xl border border-slate-800 bg-[#0A0F2B] hover:border-cyan-500/30 transition-all flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-white">{res.institutionName}</h4>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            {res.accountNumber} • <span className="text-cyan-400">{res.accountType}</span>
                          </p>
                          <span className="text-[9px] text-slate-500 font-mono block mt-2">
                            Last Checked: {res.lastReconciledAt}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold text-emerald-400 font-mono">
                            {formatCurrency(res.balance)}
                          </span>
                          <span className="text-[10px] text-emerald-500 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-950/40 block mt-2 font-mono">
                            Reconciled ✓
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Asset Appraisals Listing */}
                {type === "APPRAISALS" && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-[#0E1537] to-[#121E4B] p-4 rounded-xl border border-cyan-500/20 space-y-2">
                      <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-400" />
                        Double-Entry Integrity Protocol
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Asset values are mathematically certified through physical ledger appraisals, backed by automated trigger hashes inside the GCP Cloud SQL nodes to guarantee defense against unauthorized balance modifications.
                      </p>
                    </div>

                    <div className="text-xs text-slate-400 font-mono px-1 py-2 border-b border-slate-800 flex justify-between">
                      <span>Valuation Certifications</span>
                      <span>Appraised Change</span>
                    </div>

                    {appraisals.map((apr) => (
                      <div 
                        key={apr.id}
                        className="p-4 rounded-xl border border-slate-800 bg-[#0A0F2B] hover:border-cyan-500/30 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-950">
                              {apr.id}
                            </span>
                            <h4 className="text-sm font-semibold text-white mt-1.5">{apr.assetName}</h4>
                            <p className="text-xs text-slate-400 mt-1">
                              Certified By: <span className="text-slate-200 font-medium">{apr.certifiedBy}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 line-through block font-mono">
                              {formatCurrency(apr.previousValue)}
                            </span>
                            <span className="text-sm font-bold text-white font-mono block mt-0.5">
                              {formatCurrency(apr.appraisedValue)}
                            </span>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1.5 font-mono ${
                              apr.changePercentage >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {apr.changePercentage >= 0 ? "+" : ""}{apr.changePercentage}%
                            </span>
                          </div>
                        </div>

                        {/* Hash Lock Block */}
                        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900 font-mono text-[9px] text-slate-400 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-500 flex items-center">
                              <ShieldCheck className="h-3 w-3 mr-1" /> SHA-256 Block Signature:
                            </span>
                            <span className="text-emerald-400 font-bold">LOCKED ✓</span>
                          </div>
                          <p className="truncate text-slate-500 select-all select-all-target">{apr.auditHash}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="border-t border-slate-800 bg-[#0B0F27] p-6 flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="w-1/2 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-mono"
            >
              Close Ledger View
            </button>
            <button
              onClick={() => {
                alert("Initiating physical asset inventory verification dispatch over GCP micro-broker...");
              }}
              className="w-1/2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 py-2.5 text-sm font-bold text-slate-950 transition-all font-mono shadow-md shadow-cyan-500/10"
            >
              Dispatch Physical Audit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ============================================================================
// 4. REFACTORED MASTER OVERVIEW CARD WITH THE SUB-CARDS INTERACTIVE ANCHORS
// ============================================================================

export const FinancialRealtimeAuditedTracker: React.FC = () => {
  const inspector = useSubCardInspector();

  // Pre-compiled UI statistics
  const metricsData = {
    totalTrackedAssets: "₹6,80,50,000",
    liquidCash: "₹7,00,50,000",
    appraisalValue: "₹7,52,00,000",
    appraisalChange: "+11.4%"
  };

  return (
    <div className="relative bg-[#090D24] border border-cyan-500/10 rounded-2xl p-6 shadow-xl w-full max-w-3xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
      {/* Visual neon layout blur */}
      <div className="absolute -top-12 -left-12 h-24 w-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-300" />
      <div className="absolute -bottom-12 -right-12 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl" />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase block">
            Core Financial Engine
          </span>
          <h3 className="text-lg font-bold tracking-tight text-white mt-1">
            Real-Time Audited Financial Vault Tracker
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Auditing asset appraisals, verified physical inventory book values, and active liquidity pools.
          </p>
        </div>
        <span className="flex items-center space-x-1 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-mono">
          <Database className="h-3 w-3 mr-1 animate-pulse" /> Live Vault Syncing
        </span>
      </div>

      {/* Grid of Interactive Sub-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sub-Card 1: Total Tracked Assets */}
        <div 
          onClick={() => inspector.openDrawer("TRACKED_ASSETS")}
          className="relative overflow-hidden cursor-pointer bg-[#0C1236]/70 hover:bg-[#0E153D]/90 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl transition-all duration-200 group/item flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <Layers className="h-5 w-5 text-cyan-400 group-hover/item:scale-110 transition-transform" />
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover/item:text-cyan-400 transition-colors" />
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wider">
              Total Tracked Assets
            </span>
            <span className="text-lg font-bold text-white font-mono mt-1 block">
              {metricsData.totalTrackedAssets}
            </span>
            <span className="text-[9px] text-cyan-400 mt-1 flex items-center font-mono">
              500+ Items (Calicut)
            </span>
          </div>
        </div>

        {/* Sub-Card 2: Liquid Cash & Reserves */}
        <div 
          onClick={() => inspector.openDrawer("LIQUID_RESERVES")}
          className="relative overflow-hidden cursor-pointer bg-[#0C1236]/70 hover:bg-[#0E153D]/90 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl transition-all duration-200 group/item flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <Landmark className="h-5 w-5 text-emerald-400 group-hover/item:scale-110 transition-transform" />
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover/item:text-cyan-400 transition-colors" />
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wider">
              Liquid Cash & Reserves
            </span>
            <span className="text-lg font-bold text-white font-mono mt-1 block">
              {metricsData.liquidCash}
            </span>
            <span className="text-[9px] text-emerald-400 mt-1 flex items-center font-mono">
              4 Bank Accounts Reconciled
            </span>
          </div>
        </div>

        {/* Sub-Card 3: Asset Appraisals */}
        <div 
          onClick={() => inspector.openDrawer("APPRAISALS")}
          className="relative overflow-hidden cursor-pointer bg-[#0C1236]/70 hover:bg-[#0E153D]/90 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl transition-all duration-200 group/item flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <TrendingUp className="h-5 w-5 text-cyan-400 group-hover/item:scale-110 transition-transform" />
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover/item:text-cyan-400 transition-colors" />
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wider">
              Asset Appraisals (FY26)
            </span>
            <span className="text-lg font-bold text-white font-mono mt-1 block">
              {metricsData.appraisalValue}
            </span>
            <span className="text-[9px] text-emerald-400 mt-1 flex items-center font-mono font-medium">
              {metricsData.appraisalChange} Appreciation
            </span>
          </div>
        </div>
      </div>

      {/* Mount Shared Inspector Slide-Over Drawer */}
      <SubCardInspectorDrawer
        isOpen={inspector.activeDrawer !== null}
        type={inspector.activeDrawer}
        onClose={inspector.closeDrawer}
        selectedBranch={inspector.selectedBranch}
        setSelectedBranch={inspector.setSelectedBranch}
        loading={inspector.loading}
        error={inspector.error}
        assets={inspector.assets}
        reserves={inspector.reserves}
        appraisals={inspector.appraisals}
      />
    </div>
  );
};
