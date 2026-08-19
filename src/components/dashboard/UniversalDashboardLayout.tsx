"use client";

// ============================================================================
// SUFFAT-UL HUFFAZ ERP & LMS - UNIVERSAL DASHBOARD ENGINE (APPLE ENTERPRISE SPEC)
// File: universal-dashboard-generator.tsx
// Objective: A highly reusable, schema-driven polymorphic dashboard wrapper
//            that allows ANY sub-page (Financials, Academics, Fleet, Affiliations,
//            or Exams) to render under the exact same high-fidelity premium theme.
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, LayoutGrid, ChevronRight, X, AlertTriangle, 
  Search, Bell, Settings, LogOut, ChevronDown, CheckCircle, 
  Info, TrendingUp, DollarSign, Users, ClipboardList
} from "lucide-react";

// ============================================================================
// 1. SCHEMAS & INTERFACES FOR DYNAMIC GENERATION
// ============================================================================

export interface MetricCardConfig {
  id: string;
  title: string;
  value: string | number;
  changeLabel?: string;
  isPositive?: boolean;
  statusText?: string;
  statusType?: "success" | "warning" | "danger" | "info";
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export interface TableRowConfig {
  id: string;
  columns: {
    key: string;
    value: React.ReactNode;
    styleClass?: string;
  }[];
  onClick?: () => void;
}

export interface TableConfig {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: TableRowConfig[];
  actions?: React.ReactNode;
}

export interface SidebarLink {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

// Master Schema Consumed by the Page Generator Component
export interface UniversalDashboardSchema {
  tenantName: string;
  pageTitle: string;
  pageSubtitle: string;
  metrics: MetricCardConfig[];
  primaryTable?: TableConfig;
  secondaryWidgets?: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    content: React.ReactNode;
  }[];
  drawerTitle?: string;
  drawerSubtitle?: string;
  drawerContent?: (selectedId: string | null, onClose: () => void) => React.ReactNode;
}

// ============================================================================
// 2. DYNAMIC LAYOUT ENGINE (UniversalDashboardLayout)
// ============================================================================

interface LayoutProps {
  schema: UniversalDashboardSchema;
  sidebarLinks: SidebarLink[];
  onSidebarClick?: (id: string) => void;
}

export const UniversalDashboardLayout: React.FC<LayoutProps> = ({
  schema,
  sidebarLinks,
  onSidebarClick
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050506] font-sans antialiased text-neutral-200 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* 1. Global Apple-spec Glassmorphic Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#050506]/70 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Institution Monogram */}
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-mono text-sm font-black text-white">S</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            Suffat-ul Huffaz <span className="text-neutral-500">•</span> <span className="text-blue-400 font-mono text-xs uppercase bg-blue-950/40 px-2 py-0.5 rounded border border-blue-950">{schema.tenantName}</span>
          </span>
        </div>

        {/* Search and Quick Tools */}
        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search databases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214] border border-white/[0.08] focus:border-blue-500/40 focus:outline-none rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-neutral-500 transition-all font-mono"
            />
          </div>

          <button className="relative p-1.5 text-neutral-400 hover:text-white transition-all">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse" />
          </button>

          {/* User Account Controls */}
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 text-xs font-semibold text-neutral-300 hover:text-white transition-all bg-[#121214] border border-white/[0.06] px-3 py-1.5 rounded-full"
            >
              <div className="h-5 w-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-400">
                A
              </div>
              <span className="hidden sm:inline">Admin Gateway</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
            </button>

            {/* Account Dropdown */}
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-[#0E0F12] border border-white/[0.08] rounded-xl p-2 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-white/[0.04]">
                    <p className="text-xs font-semibold text-white">Abdullah Siddiqui</p>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5">super-admin@suffat.in</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded-md transition-all flex items-center">
                      <Settings className="h-3.5 w-3.5 mr-2" /> Systems Settings
                    </button>
                    <button className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/10 rounded-md transition-all flex items-center">
                      <LogOut className="h-3.5 w-3.5 mr-2" /> Lock Terminal Session
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Global Dual-Pane Workspace */}
      <div className="flex min-h-[calc(100vh-53px)]">
        
        {/* Sidebar Navigation Panel */}
        <aside className="w-64 border-r border-white/[0.06] bg-[#050506] p-4 hidden lg:flex flex-col justify-between">
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase px-3">
              Modules Registry
            </span>
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => onSidebarClick && onSidebarClick(link.id)}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      link.isActive
                        ? "bg-[#121214] text-white border-l-2 border-blue-500 pl-4.5"
                        : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secure Environment Banner */}
          <div className="bg-[#0E0F12] border border-white/[0.06] p-3.5 rounded-2xl flex flex-col space-y-2">
            <div className="flex items-center text-emerald-400 text-xs font-bold">
              <ShieldCheck className="h-4 w-4 mr-1.5 animate-pulse" /> RLS Enforcement Active
            </div>
            <p className="text-[10px] text-neutral-500 leading-relaxed font-mono">
              Database rows locked to active tenant session. Cryptographic double-entry validation operational.
            </p>
          </div>
        </aside>

        {/* 3. Main Dashboard Workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
          
          {/* Header Row */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {schema.pageTitle}
            </h1>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed max-w-2xl">
              {schema.pageSubtitle}
            </p>
          </div>

          {/* Bento-Grid KPI Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {schema.metrics.map((metric) => {
              const MetricIcon = metric.icon;
              return (
                <div
                  key={metric.id}
                  onClick={metric.onClick}
                  className={`bg-[#0E0F12] border border-white/[0.06] rounded-2xl p-5 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between group ${
                    metric.onClick ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-white/[0.03] border border-white/[0.04] rounded-xl group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                      <MetricIcon className="h-5 w-5 text-neutral-400 group-hover:text-blue-400" />
                    </div>
                    {metric.onClick && (
                      <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                  <div className="mt-5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                      {metric.title}
                    </span>
                    <span className="text-2xl font-light tracking-tight text-white font-mono mt-1 block">
                      {metric.value}
                    </span>
                    <div className="flex items-center space-x-2 mt-2">
                      {metric.changeLabel && (
                        <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          metric.isPositive 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {metric.changeLabel}
                        </span>
                      )}
                      {metric.statusText && (
                        <span className={`text-[10px] font-mono ${
                          metric.statusType === "success" ? "text-emerald-400" :
                          metric.statusType === "warning" ? "text-amber-400" :
                          metric.statusType === "danger" ? "text-rose-400" : "text-blue-400"
                        }`}>
                          {metric.statusText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unified Content Section: Main List/Table & Secondary Widgets */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Primary Table Segment */}
            {schema.primaryTable && (
              <div className="xl:col-span-2 bg-[#0E0F12] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-6 border-b border-white/[0.04] bg-white/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        {schema.primaryTable.title}
                      </h3>
                      {schema.primaryTable.subtitle && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {schema.primaryTable.subtitle}
                        </p>
                      )}
                    </div>
                    {schema.primaryTable.actions && (
                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        {schema.primaryTable.actions}
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                          {schema.primaryTable.headers.map((header, idx) => (
                            <th 
                              key={idx} 
                              className="px-6 py-3 text-[10px] font-bold tracking-widest text-neutral-500 uppercase font-mono"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {schema.primaryTable.rows.map((row) => (
                          <tr
                            key={row.id}
                            onClick={() => row.onClick ? row.onClick() : setSelectedRowId(row.id)}
                            className="hover:bg-white/[0.01] transition-all cursor-pointer group"
                          >
                            {row.columns.map((col, idx) => (
                              <td 
                                key={idx} 
                                className={`px-6 py-4 text-xs font-semibold ${col.styleClass || "text-neutral-300"}`}
                              >
                                {col.value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table Footer */}
                <div className="p-4 border-t border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                  <span>Displaying {schema.primaryTable.rows.length} Active Records</span>
                  <span>Press Row for Interactive Inspection</span>
                </div>
              </div>
            )}

            {/* Secondary Widgets Panel */}
            {schema.secondaryWidgets && (
              <div className="space-y-6">
                {schema.secondaryWidgets.map((widget, idx) => {
                  const WidgetIcon = widget.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-[#0E0F12] border border-white/[0.06] rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-center space-x-2 border-b border-white/[0.04] pb-3">
                        <WidgetIcon className="h-4 w-4 text-blue-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          {widget.title}
                        </h4>
                      </div>
                      <div>
                        {widget.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 4. Global Sliding Verification Drawer */}
      <AnimatePresence>
        {selectedRowId && schema.drawerContent && (
          <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-black/60 backdrop-blur-sm">
            {/* Click-out blocker */}
            <div className="absolute inset-0" onClick={() => setSelectedRowId(null)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative z-10 flex h-full w-full max-w-xl flex-col bg-[#08090B] border-l border-white/[0.08] text-neutral-100 shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] p-6 bg-[#0B0C0E]">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase font-mono">
                    {schema.drawerSubtitle || "Audit Inspector"}
                  </span>
                  <h2 className="text-base font-bold tracking-tight text-white mt-1">
                    {schema.drawerTitle || "Verification Details"}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedRowId(null)}
                  className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {schema.drawerContent(selectedRowId, () => setSelectedRowId(null))}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-white/[0.06] bg-[#0E0F12] p-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRowId(null)}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/[0.02] transition-all font-mono"
                >
                  Close Pane
                </button>
                <button
                  onClick={() => alert(`Certifying state for block: ${selectedRowId}`)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all font-mono shadow-lg shadow-blue-500/10"
                >
                  Certify & Validate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
