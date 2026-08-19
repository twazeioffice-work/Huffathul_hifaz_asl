"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MetricInspectorType } from '@/hooks/useDashboardInspector';

// Mock Fetch Helpers to simulate high-density, real-time backend data loading
interface MockDataPayload {
  title: string;
  subtitle: string;
  summaryStats: { label: string; value: string; trend?: string }[];
  detailsTable: { headers: string[]; rows: string[][] };
  metaFields: { key: string; value: string }[];
}

const mockFetcher = (type: MetricInspectorType, branch: string | null): Promise<MockDataPayload> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (type) {
        case 'PORTFOLIO_VALUE':
          resolve({
            title: 'Financial Portfolio Deep-Dive',
            subtitle: branch ? `Branch: ${branch}` : 'Consolidated National Vault Ledger',
            summaryStats: [
              { label: 'Total Portfolio Valuation', value: '₹14,82,50,000.00', trend: '+12.4% vs Last Q' },
              { label: 'Liquid Cash & Reserves', value: '₹3,45,12,000.00', trend: 'Secure Vault' },
              { label: 'Asset Appraisals (FY26)', value: '₹11,37,38,000.00', trend: 'Audited' },
            ],
            metaFields: [
              { key: 'Lead Trustee Sign-Off', value: 'CFO / Hazrat Maulana Yusuf Siddiqui' },
              { key: 'Last SHA-256 Audit Seal', value: '9a3f2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a' },
              { key: 'Last Verification Stamp', value: '2026-08-19 10:24:12 UTC' },
            ],
            detailsTable: {
              headers: ['Asset Type', 'Account Code', 'Appraised Value', 'Status'],
              rows: [
                ['Real Estate (Campus Ground)', 'PROP-RE-KER-01', '₹8,50,00,000.00', 'Active / Verified'],
                ['Fixed Deposits & Endowments', 'FD-BANK-SBI-09', '₹2,50,00,000.00', 'Matured / Locked'],
                ['Gold & Liquid Bullion Vault', 'AU-VAULT-HQ-02', '₹1,25,00,000.00', 'Physically Audited'],
                ['Educational Fleet Reserves', 'EQUIP-FLT-098', '₹1,48,50,000.00', 'Depreciated Val'],
              ],
            },
          });
          break;

        case 'TRANSPORT_FLEET':
          resolve({
            title: 'Active Transport Fleet Inspector',
            subtitle: 'Real-time GPS Tracking & Telemetry',
            summaryStats: [
              { label: 'Active Vehicles on Road', value: '32 / 36 Buses & Vans', trend: '92% Dispatch' },
              { label: 'Pending Safety Checks', value: '0 Vehicles', trend: '100% Compliant' },
              { label: 'Total Daily Fleet Fuel', value: '1,420 Liters', trend: 'Within Budget' },
            ],
            metaFields: [
              { key: 'Fleet Commander', value: 'SRE / Transport Lead Brother Bilal Ahmed' },
              { key: 'GCP PubSub Queue Topic', value: 'fleet-telemetry-live-sub' },
              { key: 'Telemetry Ping Status', value: 'Healthy (2s interval)' },
            ],
            detailsTable: {
              headers: ['Vehicle ID', 'Driver Name', 'Assigned Route', 'Status', 'Fuel %'],
              rows: [
                ['BUS-KER-01', 'Brother Muhammad Amin', 'Route 12 (Calicut Coast)', 'Active / Live GPS', '78%'],
                ['BUS-KER-02', 'Brother Abdul Hakeem', 'Route 4 (Malappuram Town)', 'Active / Live GPS', '52%'],
                ['VAN-KER-03', 'Brother Tariq Mahmood', 'Route 15 (Wayanad Hills)', 'On Break', '90%'],
                ['BUS-KER-04', 'Brother Salim Riaz', 'Route 9 (Kochi Express)', 'Active / Live GPS', '43%'],
              ],
            },
          });
          break;

        case 'DORMITORY_CAPACITY':
          resolve({
            title: 'Dormitory Bed Capacity Auditor',
            subtitle: 'Boarding, Hifz Dorms & Housing Allocation',
            summaryStats: [
              { label: 'Total Bed Capacity', value: '1,200 Beds (National)', trend: '94% Allocated' },
              { label: 'Active Occupants', value: '1,128 Students', trend: '72 Free Beds' },
              { label: 'Pending Allocations', value: '15 Boarders', trend: 'Waiting List' },
            ],
            metaFields: [
              { key: 'Chief Warden', value: 'Maulana Hafiz Bilal Mansoor' },
              { key: 'Health & Safety Rating', value: 'Grade A (Audited August 2026)' },
              { key: 'Last Roll Call Status', value: 'Completed (100% Accounted)' },
            ],
            detailsTable: {
              headers: ['Dorm Block', 'Warden-in-Charge', 'Total Beds', 'Occupied Beds', 'Available'],
              rows: [
                ['Al-Safa Block (Junior Dorms)', 'Hafiz Anas Ali', '300', '280', '20 Beds'],
                ['Al-Marwah Block (Senior Hifz)', 'Hafiz Salman Khan', '400', '392', '8 Beds'],
                ['Abu Bakr Siddique Block', 'Hafiz Zubair Qazi', '250', '216', '34 Beds'],
                ['Umar Farooq Block (Aspirants)', 'Hafiz Usman Ghani', '250', '240', '10 Beds'],
              ],
            },
          });
          break;

        case 'PHYSICAL_ASSETS':
          resolve({
            title: 'Physical & Digital Asset Registry',
            subtitle: 'Property, Plant, & Educational Equipment Logs',
            summaryStats: [
              { label: 'Total Tracked Assets', value: '4,850 Units', trend: 'All Tagged' },
              { label: 'Registry Book Value', value: '₹4,32,15,000.00', trend: 'Depreciated' },
              { label: 'Asset Inspection Status', value: '100% Labeled', trend: 'Barcode Synced' },
            ],
            metaFields: [
              { key: 'Inventory Auditor', value: 'Brother Saeed-ur-Rehman' },
              { key: 'Database Master Schema', value: 'tenant_physical_assets' },
              { key: 'Tagging Protocol', value: 'RFID / Dynamic QR Code Matrix' },
            ],
            detailsTable: {
              headers: ['Asset Tag ID', 'Asset Category', 'Assigned Location', 'Depreciation Class', 'Status'],
              rows: [
                ['AST-IT-8840', 'Smartboard 4K Displays', 'Classroom 3A (Kerala Campus)', 'Straight-line (5 yr)', 'Operational'],
                ['AST-IT-9011', 'LMS Client Thin Clients', 'Digital Lab 2B', 'Declining-balance', 'Operational'],
                ['AST-LIB-4512', 'Rare Classical Tafseer Set', 'Central Vault Library', 'Non-depreciating', 'Archived'],
                ['AST-GEN-3091', 'Backup Diesel Generator', 'Utility Yard South', 'Double-declining', 'Active / Service Ok'],
              ],
            },
          });
          break;
        default:
          resolve({
            title: 'Metric Deep-Dive',
            subtitle: 'Real-time telemetry and ledger analytics',
            summaryStats: [],
            metaFields: [],
            detailsTable: { headers: [], rows: [] }
          });
      }
    }, 400); // 400ms loading simulator
  });
};

interface MetricInspectorDrawerProps {
  isOpen: boolean;
  activeType: MetricInspectorType;
  branchContext: string | null;
  onClose: () => void;
}

export const MetricInspectorDrawer: React.FC<MetricInspectorDrawerProps> = ({
  isOpen,
  activeType,
  branchContext,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<MockDataPayload | null>(null);

  useEffect(() => {
    if (isOpen && activeType) {
      setLoading(true);
      mockFetcher(activeType, branchContext).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [isOpen, activeType, branchContext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-[#090D1A] border-l border-cyan-500/20 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-cyan-500/10 flex justify-between items-center bg-[#0C1226]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Real-time Audited Metric Tracker
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {loading ? 'Decrypting Secure Logs...' : data?.title}
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  {loading ? 'Synchronizing with Google Cloud SQL...' : data?.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 border border-slate-700/50 text-slate-400 transition-colors"
                aria-label="Close Inspector"
              >
                ✕
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading ? (
                /* Skeletal Loading Animation */
                <div className="space-y-6 animate-pulse">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-slate-800/40 rounded-xl border border-slate-700/10" />
                    ))}
                  </div>
                  <div className="h-40 bg-slate-800/40 rounded-xl border border-slate-700/10" />
                  <div className="space-y-3">
                    <div className="h-6 bg-slate-800/40 rounded w-1/4" />
                    <div className="h-20 bg-slate-800/40 rounded-xl" />
                  </div>
                </div>
              ) : (
                data && (
                  <>
                    {/* Summary Metric Stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.summaryStats.map((stat, i) => (
                        <div
                          key={i}
                          className="p-4 bg-[#0F162E] border border-cyan-500/10 rounded-xl hover:border-cyan-500/20 transition-all flex flex-col justify-between"
                        >
                          <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                          <span className="text-lg font-extrabold text-white mt-1">{stat.value}</span>
                          {stat.trend && (
                            <span className="text-[10px] font-semibold text-emerald-400 mt-1 flex items-center">
                              ● {stat.trend}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Meta Fields (Cryptographic Audit Stamps) */}
                    <div className="p-4 bg-cyan-950/10 border border-cyan-500/10 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                        Audit Signature Seal
                      </h4>
                      {data.metaFields.map((field, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">{field.key}:</span>
                          <span className="font-mono text-white text-right break-all ml-4">
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Nested Detailed Registry Table */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Linked Physical Records
                      </h4>
                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-[#080C1B]">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#0C1226] border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                              {data.detailsTable.headers.map((header, idx) => (
                                <th key={idx} className="p-3">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                            {data.detailsTable.rows.map((row, rowIdx) => (
                              <tr
                                key={rowIdx}
                                className="hover:bg-cyan-500/5 transition-colors font-medium"
                              >
                                {row.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="p-3 font-mono">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>

            {/* Drawer Footer controls */}
            <div className="p-6 border-t border-cyan-500/10 bg-[#0C1226] flex justify-between items-center">
              <span className="text-[10px] text-slate-400 italic">
                Securely synced from Google Cloud instance via p99 API.
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-[#090D1A] bg-cyan-400 hover:bg-cyan-300 transition-all rounded-lg shadow-lg shadow-cyan-400/20 uppercase tracking-wider"
              >
                Close Audit View
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
