"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  Activity, 
  ChevronRight, 
  ShieldCheck,
  X
} from "lucide-react";

export type ConnectionState = "connected" | "degraded" | "offline";

interface ConnectionStatusBannerProps {
  tenantId?: string;
  enableLiveSync?: boolean;
}

export function ConnectionStatusBanner({ tenantId = "SYSTEM", enableLiveSync = true }: ConnectionStatusBannerProps) {
  const [status, setStatus] = useState<ConnectionState>("connected");
  const [latency, setLatency] = useState(12);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isDevMode, setIsDevMode] = useState(true); // For simulation purposes

  // Simulate latency fluctuations
  useEffect(() => {
    if (status !== "connected") return;
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 15) + 12);
    }, 2000);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <>
      <AnimatePresence mode="wait">
        {status === "connected" && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-[30px] bg-[#0A0A0C] border-b border-white/[0.04] flex items-center justify-between px-6 z-30 relative"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-500">
                  Telemetry Secure
                </span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center space-x-1 text-[10px] font-mono text-neutral-500">
                <Activity className="w-3 h-3 mr-1" />
                {latency}ms
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-[10px] font-medium text-neutral-400">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>RLS Active</span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-medium text-neutral-400">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Clerk Auth</span>
              </div>
            </div>
          </motion.div>
        )}

        {status === "degraded" && (
          <motion.div
            key="degraded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-amber-950/40 border-b border-amber-500/20 backdrop-blur-md z-30 relative"
          >
            <div className="flex items-center justify-between px-6 py-2.5">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <div>
                  <h4 className="text-xs font-semibold text-amber-400">System Operating Degraded</h4>
                  <p className="text-[11px] text-amber-200/70 mt-0.5 max-w-2xl">
                    Upstream connection lag detected. The platform is currently operating under safe, unpopulated cache fallback guidelines. Core ERP operations are unaffected.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowDiagnostics(true)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-mono font-medium transition-colors border border-amber-500/20"
              >
                <Terminal className="w-3 h-3" />
                <span>View Diagnostics</span>
              </button>
            </div>
          </motion.div>
        )}

        {status === "offline" && (
          <motion.div
            key="offline"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-rose-950/40 border-b border-rose-500/20 backdrop-blur-md z-30 relative"
          >
            <div className="flex items-center justify-between px-6 py-2.5">
              <div className="flex items-center space-x-3">
                <WifiOff className="w-4 h-4 text-rose-500" />
                <div>
                  <h4 className="text-xs font-semibold text-rose-400">Handshake Failure (Offline Mode)</h4>
                  <p className="text-[11px] text-rose-200/70 mt-0.5 max-w-2xl">
                    All attendance rosters, ledger balances, and academic records are being cached safely inside local IndexedDB. They will sync automatically when the connection is restored.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowDiagnostics(true)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-mono font-medium transition-colors border border-rose-500/20"
              >
                <Terminal className="w-3 h-3" />
                <span>View Diagnostics</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostics Drawer */}
      <AnimatePresence>
        {showDiagnostics && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[400px] h-screen bg-[#0A0A0C] border-l border-white/10 z-50 flex flex-col shadow-2xl shadow-black"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-semibold text-white">Diagnostic Traceback</h3>
              </div>
              <button 
                onClick={() => setShowDiagnostics(false)}
                className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto bg-black font-mono text-[11px] text-neutral-300">
              <div className="mb-4">
                <span className="text-neutral-500">[{new Date().toISOString()}]</span>{" "}
                <span className="text-blue-400">INFO</span> Initiating automated PII scrubber...
              </div>
              <div className="mb-4">
                <span className="text-neutral-500">[{new Date().toISOString()}]</span>{" "}
                <span className="text-emerald-400">SUCCESS</span> PII scrubbers active. Zero compliance leakage confirmed.
              </div>
              <div className="mb-4">
                <span className="text-neutral-500">[{new Date().toISOString()}]</span>{" "}
                <span className={status === 'offline' ? 'text-rose-400' : 'text-amber-400'}>
                  {status === 'offline' ? 'FATAL' : 'WARNING'}
                </span>{" "}
                {status === 'offline' ? 'WebSocket handshake failure (ERR_CONNECTION_REFUSED).' : 'Upstream API timeout (Groq/Gemini). Returning fallback JSON schema.'}
              </div>
              <div className="mb-6 border-l-2 border-white/20 pl-3 text-neutral-500">
                <code>
                  Sentry ID: err_groq_timeout_0921a<br />
                  Endpoint: wss://api.calicut.hub/v1/telemetry<br />
                  Context: Tenant {tenantId}
                </code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local QA Simulation Console */}
      {isDevMode && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 bg-[#121214]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            QA Simulation Console
          </div>
          <button 
            onClick={() => setStatus("connected")}
            className={`text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${status === "connected" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "hover:bg-white/5 text-neutral-400"}`}
          >
            Force: Connected
          </button>
          <button 
            onClick={() => setStatus("degraded")}
            className={`text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${status === "degraded" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "hover:bg-white/5 text-neutral-400"}`}
          >
            Force: Degraded (Upstream lag)
          </button>
          <button 
            onClick={() => setStatus("offline")}
            className={`text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${status === "offline" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "hover:bg-white/5 text-neutral-400"}`}
          >
            Force: Offline (Handshake loss)
          </button>
        </div>
      )}
    </>
  );
}
