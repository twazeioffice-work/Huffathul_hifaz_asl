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
import { ConnectionStatusBanner } from "./ConnectionStatusBanner";

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
    isAction?: boolean;
  }[];
  onClick?: () => void;
  metaData?: any;
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
  sidebarLinks?: SidebarLink[];
  onSidebarClick?: (id: string) => void;
  onRowActionClick?: (rowId: string, metaData?: any) => void;
}

export const UniversalDashboardLayout: React.FC<LayoutProps> = ({
  schema,
  sidebarLinks = [],
  onSidebarClick,
  onRowActionClick
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050506] font-sans antialiased text-neutral-200 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Real-Time Connection Alert Banner */}
      <ConnectionStatusBanner tenantId={schema.tenantName || "CALICUT-HUB"} enableLiveSync={true} />

      {/* 2. Global Dual-Pane Workspace */}
      <div className="flex min-h-[calc(100vh-53px)]">
        
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
                            onClick={() => {
                              if (row.onClick) row.onClick();
                              if (onRowActionClick) onRowActionClick(row.id, row.metaData);
                              setSelectedRowId(row.id);
                            }}
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
