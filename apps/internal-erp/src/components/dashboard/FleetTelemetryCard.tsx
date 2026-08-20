// ============================================================================
// SUFFAT-UL HUFFAZ ERP & LMS - ACTIVE TRANSPORT FLEET OPERATIONAL TRACE ENGINE
// ============================================================================
// File: FleetTelemetryCard.tsx
// Purpose: Implements interactive deep-dive traceability across the Active Fleet
//          and Financial operations (Maintenance, Fuel, RTO, and Insurance).
//          Strictly excludes GPS hardware dependencies per requirements.
// Language: TypeScript (React / Next.js App Router with Tailwind CSS)
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Droplet, 
  ShieldAlert, 
  FileText, 
  X, 
  Calendar, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';

// ============================================================================
// 1. DATA CONTRACTS & INTERFACES
// ============================================================================

export interface MaintenanceRecord {
  id: string;
  date: string;
  description: string;
  partsReplaced: string[];
  vendor: string;
  cost: number;
}

export interface FuelLog {
  id: string;
  date: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerReading: number;
  efficiencyKmpl: number;
}

export interface RTOFeeRecord {
  id: string;
  paymentDate: string;
  feeType: 'FITNESS_CERT' | 'ROAD_TAX' | 'PERMIT_RENEWAL' | 'CHALLAN';
  receiptNumber: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export interface InsurancePolicy {
  policyNumber: string;
  provider: string;
  premiumAmount: number;
  coverageDetails: string;
  startDate: string;
  expiryDate: string;
  daysToRenewal: number;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  makeModel: string;
  capacitySeats: number;
  status: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE';
  totalMaintenanceYTD: number;
  averageFuelYTD: number; // liters/month
  rtoStatus: 'COMPLIANT' | 'ACTION_REQUIRED';
  insuranceStatus: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
  maintenanceRecords: MaintenanceRecord[];
  fuelLogs: FuelLog[];
  rtoRecords: RTOFeeRecord[];
  insurancePolicy: InsurancePolicy;
}

// ============================================================================
// 2. STATE MANAGER HOOK (useFleetInspector)
// ============================================================================

export function useFleetInspector() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'fuel' | 'rto_insurance'>('overview');

  useEffect(() => {
    if (!selectedVehicleId) {
      setVehicleData(null);
      return;
    }

    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate real-time API fetch from Google Cloud SQL FastAPI gateway
        // Route: GET /api/v1/fleet/vehicles/{id}/inspect
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        const mockData: Record<string, Vehicle> = {
          'VEH-KL-128': {
            id: 'VEH-KL-128',
            licensePlate: 'KL-01-CB-8801',
            makeModel: 'Tata Winger 15S (School Bus Edition)',
            capacitySeats: 15,
            status: 'OPERATIONAL',
            totalMaintenanceYTD: 42350,
            averageFuelYTD: 280,
            rtoStatus: 'COMPLIANT',
            insuranceStatus: 'ACTIVE',
            maintenanceRecords: [
              { id: 'MNT-001', date: '2026-07-15', description: 'Engine oil flushed, air filters cleaned', partsReplaced: ['Engine Oil 15W40', 'Air Filter Element'], vendor: 'Tata Authorized Service Kerala', cost: 12450 },
              { id: 'MNT-002', date: '2026-05-10', description: 'Front brake pad replacement and disc skimming', partsReplaced: ['Front Brake Pads (L/R)', 'Brake Fluid Dot 4'], vendor: 'National Fleet Garage', cost: 8900 },
              { id: 'MNT-003', date: '2026-02-18', description: 'Suspension bushing replacement & alignment', partsReplaced: ['Suspension Bush Kit', 'Tie Rod Ends'], vendor: 'National Fleet Garage', cost: 21000 }
            ],
            fuelLogs: [
              { id: 'FL-01', date: '2026-08-15', liters: 45, costPerLiter: 98.40, totalCost: 4428, odometerReading: 48900, efficiencyKmpl: 11.2 },
              { id: 'FL-02', date: '2026-08-08', liters: 42, costPerLiter: 98.40, totalCost: 4132.8, odometerReading: 48430, efficiencyKmpl: 11.1 },
              { id: 'FL-03', date: '2026-08-01', liters: 48, costPerLiter: 97.90, totalCost: 4699.2, odometerReading: 47900, efficiencyKmpl: 10.8 }
            ],
            rtoRecords: [
              { id: 'RTO-01', paymentDate: '2026-03-01', feeType: 'FITNESS_CERT', receiptNumber: 'KL-RTO-2026-99381', amount: 3500, status: 'PAID' },
              { id: 'RTO-02', paymentDate: '2026-01-10', feeType: 'ROAD_TAX', receiptNumber: 'KL-RTO-2026-10482', amount: 12000, status: 'PAID' }
            ],
            insurancePolicy: {
              policyNumber: 'INS-TATA-77382910',
              provider: 'United India Insurance Co.',
              premiumAmount: 24500,
              coverageDetails: 'Bumper-to-Bumper Third-Party + Cashless Commercial School Vehicle Shield',
              startDate: '2025-10-01',
              expiryDate: '2026-10-01',
              daysToRenewal: 43
            }
          },
          'VEH-UP-402': {
            id: 'VEH-UP-402',
            licensePlate: 'UP-16-AT-9022',
            makeModel: 'Force Traveller 3050 Class',
            capacitySeats: 17,
            status: 'UNDER_MAINTENANCE',
            totalMaintenanceYTD: 58900,
            averageFuelYTD: 310,
            rtoStatus: 'ACTION_REQUIRED',
            insuranceStatus: 'EXPIRING_SOON',
            maintenanceRecords: [
              { id: 'MNT-101', date: '2026-08-17', description: 'Alternator replacement and wiring overhaul', partsReplaced: ['Alternator Assembly', 'Battery Terminals'], vendor: 'Capital Auto Diagnostics', cost: 18500 },
              { id: 'MNT-102', date: '2026-06-02', description: 'AC compressor rebuild & gas charging', partsReplaced: ['AC Compressor Kit', 'R134a Coolant Gas'], vendor: 'Capital Auto Diagnostics', cost: 15400 }
            ],
            fuelLogs: [
              { id: 'FL-11', date: '2026-08-12', liters: 50, costPerLiter: 96.20, totalCost: 4810, odometerReading: 62100, efficiencyKmpl: 9.8 },
              { id: 'FL-12', date: '2026-08-04', liters: 52, costPerLiter: 96.20, totalCost: 5002.4, odometerReading: 61610, efficiencyKmpl: 9.6 }
            ],
            rtoRecords: [
              { id: 'RTO-11', paymentDate: '2026-04-15', feeType: 'ROAD_TAX', receiptNumber: 'UP-RTO-2026-4482', amount: 14500, status: 'PAID' },
              { id: 'RTO-12', paymentDate: 'Pending', feeType: 'FITNESS_CERT', receiptNumber: 'N/A', amount: 4500, status: 'OVERDUE' }
            ],
            insurancePolicy: {
              policyNumber: 'INS-FORCE-1049281',
              provider: 'ICICI Lombard General Insurance',
              premiumAmount: 28900,
              coverageDetails: 'Standard Comprehensive Commercial Passenger Cover',
              startDate: '2025-09-02',
              expiryDate: '2026-09-02',
              daysToRenewal: 14
            }
          }
        };

        const result = mockData[selectedVehicleId];
        if (result) {
          setVehicleData(result);
        } else {
          setError('Vehicle record not found on live database registers.');
        }
      } catch (err: any) {
        setError(err.message || 'Error pulling live telemetry profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [selectedVehicleId]);

  const openInspector = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setActiveTab('overview');
  };

  const closeInspector = () => {
    setSelectedVehicleId(null);
  };

  return {
    selectedVehicleId,
    vehicleData,
    loading,
    error,
    activeTab,
    setActiveTab,
    openInspector,
    closeInspector
  };
}

// ============================================================================
// 3. TELEMETRY SLIDE-OVER DRAWER COMPONENT
// ============================================================================

interface FleetInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  vehicle: Vehicle | null;
  activeTab: 'overview' | 'maintenance' | 'fuel' | 'rto_insurance';
  setActiveTab: (tab: 'overview' | 'maintenance' | 'fuel' | 'rto_insurance') => void;
}

export const FleetInspectorDrawer: React.FC<FleetInspectorDrawerProps> = ({
  isOpen,
  onClose,
  loading,
  error,
  vehicle,
  activeTab,
  setActiveTab
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Glass Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#060814]/80 backdrop-blur-sm"
          />

          {/* Drawer Sidebar Frame */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l border-cyan-500/20 bg-[#0D152D] p-6 shadow-2xl shadow-cyan-500/5 focus:outline-none"
            role="dialog"
            aria-modal="true"
          >
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#00F0FF] uppercase">
                  Active Asset Inspection
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  {loading ? 'Interrogating Database...' : vehicle?.licensePlate || 'Fleet Register'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-cyan-500/10 bg-[#060814]/40 p-2 text-cyan-400 hover:border-cyan-500/40 hover:text-white transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <div>
                  <h4 className="font-semibold text-red-400">Database Connection Error</h4>
                  <p className="text-xs text-red-300 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Loading Skeleton States */}
            {loading && (
              <div className="mt-6 space-y-6">
                <div className="h-12 w-full animate-pulse rounded-xl bg-cyan-950/20" />
                <div className="space-y-3">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-cyan-950/20" />
                  <div className="h-24 w-full animate-pulse rounded-xl bg-cyan-950/20" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-1/4 animate-pulse rounded bg-cyan-950/20" />
                  <div className="h-32 w-full animate-pulse rounded-xl bg-cyan-950/20" />
                </div>
              </div>
            )}

            {/* Dynamic Content Panel */}
            {!loading && vehicle && (
              <div className="mt-6 flex h-[calc(100vh-140px)] flex-col justify-between">
                <div>
                  {/* Custom Navigation Tab bar */}
                  <div className="flex border-b border-cyan-500/10 bg-[#060814]/30 p-1 rounded-xl">
                    {(['overview', 'maintenance', 'fuel', 'rto_insurance'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-lg py-2 text-xs font-bold capitalize tracking-wider transition-all duration-300 ${
                          activeTab === tab
                            ? 'bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/30'
                            : 'text-gray-400 hover:text-cyan-300'
                        }`}
                      >
                        {tab.replace('_', ' & ')}
                      </button>
                    ))}
                  </div>

                  {/* Scrollable Container */}
                  <div className="mt-6 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 space-y-6">
                    {/* OVERVIEW MODULE */}
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 p-4">
                          <span className="text-xs font-bold text-gray-400">Model Specification</span>
                          <p className="text-lg font-bold text-white mt-1">{vehicle.makeModel}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 p-4">
                            <span className="text-xs font-bold text-gray-400">Total Seating Capacity</span>
                            <p className="text-xl font-extrabold text-white mt-1">{vehicle.capacitySeats} Seats</p>
                          </div>
                          <div className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 p-4">
                            <span className="text-xs font-bold text-gray-400">Vehicle Operational State</span>
                            <span className={`inline-flex items-center gap-1.5 mt-2 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              vehicle.status === 'OPERATIONAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              vehicle.status === 'UNDER_MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              <span className={`h-2 w-2 rounded-full ${
                                vehicle.status === 'OPERATIONAL' ? 'bg-emerald-400' :
                                vehicle.status === 'UNDER_MAINTENANCE' ? 'bg-amber-400' : 'bg-red-400'
                              }`} />
                              {vehicle.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 p-4 space-y-3">
                          <h4 className="font-bold text-white flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-[#00F0FF]" /> Fleet Audit Snapshot (YTD)
                          </h4>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <span className="text-xs text-gray-400">Maintenance Cost Total</span>
                              <p className="text-lg font-bold text-white">₹{vehicle.totalMaintenanceYTD.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400">Avg Fuel Consumption</span>
                              <p className="text-lg font-bold text-white">{vehicle.averageFuelYTD} L/Month</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MAINTENANCE DETAILS MODULE */}
                    {activeTab === 'maintenance' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-[#00F0FF]" /> Live Service Ledgers
                          </h3>
                          <span className="text-xs font-semibold text-cyan-400">
                            Total Ledger: ₹{vehicle.totalMaintenanceYTD.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {vehicle.maintenanceRecords.map((record) => (
                            <div 
                              key={record.id} 
                              className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 p-4 hover:border-cyan-500/30 transition-all duration-200"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-xs text-[#00F0FF] font-semibold">{record.id}</span>
                                  <h4 className="font-bold text-white mt-1">{record.description}</h4>
                                </div>
                                <span className="text-sm font-bold text-cyan-300">₹{record.cost.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {record.partsReplaced.map((part, index) => (
                                  <span key={index} className="rounded-md bg-cyan-950/40 border border-cyan-500/10 px-2 py-0.5 text-3xs text-cyan-300 font-semibold uppercase tracking-wider">
                                    {part}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-3 flex justify-between items-center text-xs text-gray-400 border-t border-cyan-500/5 pt-2.5">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {record.date}</span>
                                <span className="text-cyan-400 font-medium">@ {record.vendor}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FUEL TRACKER MODULE */}
                    {activeTab === 'fuel' && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-[#00F0FF]" /> Dynamic Fuel Consumption Journals
                        </h3>
                        <div className="space-y-3">
                          {vehicle.fuelLogs.map((log) => (
                            <div 
                              key={log.id} 
                              className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 p-4 hover:border-cyan-500/30 transition-all duration-200"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-xs text-[#00F0FF] font-semibold">{log.id}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-lg font-bold text-white">{log.liters} Liters</span>
                                    <span className="text-xs text-gray-400">({log.efficiencyKmpl} km/L)</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-gray-400">@ ₹{log.costPerLiter}/L</span>
                                  <p className="text-base font-bold text-cyan-300 mt-0.5">₹{log.totalCost.toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                              <div className="mt-3 flex justify-between items-center text-xs text-gray-400 border-t border-cyan-500/5 pt-2.5">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {log.date}</span>
                                <span className="font-semibold text-[#00F0FF]">Odo: {log.odometerReading.toLocaleString()} km</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RTO & INSURANCE REGULATORY MODULE */}
                    {activeTab === 'rto_insurance' && (
                      <div className="space-y-6">
                        {/* RTO Fees Section */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-white flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#00F0FF]" /> Registration RTO Fees & Permits
                          </h3>
                          <div className="space-y-2">
                            {vehicle.rtoRecords.map((rto) => (
                              <div key={rto.id} className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{rto.feeType.replace('_', ' ')}</span>
                                    <p className="text-xs text-gray-400 mt-1">Receipt ID: {rto.receiptNumber}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-bold text-white">₹{rto.amount.toLocaleString('en-IN')}</span>
                                    <div className="mt-1">
                                      <span className={`inline-flex rounded-full px-2 py-0.5 text-2xs font-bold ${
                                        rto.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                      }`}>
                                        {rto.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Commercial Insurance Panel */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-[#00F0FF]" /> Commercial Fleet Insurance Policy
                          </h3>
                          <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-[#0A0E22] p-4 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-2xs text-[#00F0FF] uppercase tracking-wider font-bold">Policy Number</span>
                                <h4 className="font-extrabold text-white mt-0.5">{vehicle.insurancePolicy.policyNumber}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-2xs text-gray-400">Annual Premium</span>
                                <p className="font-bold text-cyan-300 mt-0.5">₹{vehicle.insurancePolicy.premiumAmount.toLocaleString('en-IN')}</p>
                              </div>
                            </div>

                            <div className="border-t border-cyan-500/5 pt-3">
                              <span className="text-2xs text-gray-400">Carrier Provider</span>
                              <p className="text-sm font-bold text-white mt-0.5">{vehicle.insurancePolicy.provider}</p>
                            </div>

                            <div className="border-t border-cyan-500/5 pt-3">
                              <span className="text-2xs text-gray-400">Coverage Class Details</span>
                              <p className="text-xs text-gray-300 mt-0.5">{vehicle.insurancePolicy.coverageDetails}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-cyan-500/5 pt-3">
                              <div>
                                <span className="text-2xs text-gray-400">Policy Launch Date</span>
                                <p className="text-xs font-bold text-white mt-0.5">{vehicle.insurancePolicy.startDate}</p>
                              </div>
                              <div>
                                <span className="text-2xs text-gray-400">Policy Expiration Date</span>
                                <p className="text-xs font-bold text-white mt-0.5">{vehicle.insurancePolicy.expiryDate}</p>
                              </div>
                            </div>

                            {/* Renewal Urgency countdown banner */}
                            <div className={`mt-3 rounded-lg border px-3 py-2 flex items-center justify-between text-xs font-bold ${
                              vehicle.insurancePolicy.daysToRenewal <= 15 
                                ? 'bg-red-500/10 border-red-500/20 text-red-300'
                                : 'bg-cyan-500/10 border-cyan-500/20 text-[#00F0FF]'
                            }`}>
                              <span>Days Remaining to Renewal Gate:</span>
                              <span>{vehicle.insurancePolicy.daysToRenewal} Days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Foot Action Panel */}
                <div className="border-t border-cyan-500/10 pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      // Trigger mock invoice generator
                      alert(`Compiling official RTO and Operational Ledger Report for vehicle ${vehicle.licensePlate}. PDF ready inside GCS.`);
                    }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 py-3 text-center text-xs font-extrabold text-white hover:from-cyan-400 hover:to-cyan-500 shadow-lg shadow-cyan-500/10 transition-all duration-300"
                  >
                    Generate Fleet Compliance Audit
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-cyan-500/10 bg-[#060814]/40 px-6 py-3 text-xs font-extrabold text-gray-400 hover:border-cyan-500/30 hover:text-white transition-all duration-200"
                  >
                    Close Inspection
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 4. MAIN TELEMETRY CARD PANEL (FOR PARENT DASHBOARDS)
// ============================================================================

export const FleetTelemetryCard: React.FC = () => {
  const {
    selectedVehicleId,
    vehicleData,
    loading,
    error,
    activeTab,
    setActiveTab,
    openInspector,
    closeInspector
  } = useFleetInspector();

  // Primary mock dataset rendered on the card landing
  const rootVehicles = [
    { id: 'VEH-KL-128', plate: 'KL-01-CB-8801', model: 'Tata Winger 15S', maintenance: 42350, renewal: '12 Oct 2026', fuel: '280 L', state: 'OPERATIONAL' },
    { id: 'VEH-UP-402', plate: 'UP-16-AT-9022', model: 'Force Traveller 3050', maintenance: 58900, renewal: '02 Sep 2026', fuel: '310 L', state: 'UNDER_MAINTENANCE' }
  ];

  return (
    <div className="w-full">
      {/* High-Polish Dashboard Landing Card */}
      <div className="rounded-2xl border border-cyan-500/10 bg-gradient-to-b from-[#0D152D] to-[#0A0E22] p-5 shadow-xl hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex justify-between items-center border-b border-cyan-500/5 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#00F0FF]" /> Active Transport Fleet Inspector
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Real-time operational records tracking maintenance logs, fuel accounting, and regulatory RTO metrics.
            </p>
          </div>
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-2xs font-extrabold text-[#00F0FF] uppercase tracking-wider">
            GPS Engine Bypassed
          </span>
        </div>

        {/* Dynamic Interactive Listing Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cyan-500/5 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <th className="py-2.5 px-3">Vehicle Details</th>
                <th className="py-2.5 px-3">Maintenance (YTD)</th>
                <th className="py-2.5 px-3">Monthly Fuel</th>
                <th className="py-2.5 px-3">Insurance Renewal</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {rootVehicles.map((veh) => (
                <tr 
                  key={veh.id}
                  onClick={() => openInspector(veh.id)}
                  className="border-b border-cyan-500/5 hover:bg-cyan-500/5 cursor-pointer group transition-all duration-150"
                >
                  <td className="py-3.5 px-3">
                    <div className="font-extrabold text-white group-hover:text-[#00F0FF] group-hover:underline decoration-cyan-400 transition-all duration-150">
                      {veh.plate}
                    </div>
                    <div className="text-2xs text-gray-400 mt-0.5">{veh.model} ({veh.id})</div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-gray-200">
                    ₹{veh.maintenance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-gray-200">
                    {veh.fuel}
                  </td>
                  <td className="py-3.5 px-3 text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-cyan-400" /> {veh.renewal}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      veh.state === 'OPERATIONAL' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {veh.state.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Dynamic Detail View drawer portal */}
      <FleetInspectorDrawer
        isOpen={selectedVehicleId !== null}
        onClose={closeInspector}
        loading={loading}
        error={error}
        vehicle={vehicleData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
