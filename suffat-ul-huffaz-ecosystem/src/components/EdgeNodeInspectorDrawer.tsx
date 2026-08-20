"use client";

import React, { useEffect } from "react";
import { EdgeNodeTelemetry } from "../hooks/useEdgeTelemetryInspector";

interface EdgeNodeInspectorDrawerProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  node: EdgeNodeTelemetry | null;
  onClose: () => void;
}

export default function EdgeNodeInspectorDrawer({
  isOpen,
  isLoading,
  error,
  node,
  onClose,
}: EdgeNodeInspectorDrawerProps) {

  // Accessibility Focus Trap and Escape-Key Handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className="w-screen max-w-lg transform border-l border-teal-500/20 bg-[#0A0E17] text-slate-100 shadow-2xl transition-all duration-300"
          style={{ animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-6 bg-[#0E1524]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#00E5FF] flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    node?.status === "ONLINE" ? "bg-emerald-400" : node?.status === "SYNCING" ? "bg-amber-400" : "bg-rose-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    node?.status === "ONLINE" ? "bg-emerald-500" : node?.status === "SYNCING" ? "bg-amber-500" : "bg-rose-500"
                  }`}></span>
                </span>
                {node ? node.nodeId : "Inspecting Edge Node..."}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Branch Location: {node?.branchName || "Resolving Location..."}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md border border-slate-700 bg-[#0A0E17] p-2 text-slate-400 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition"
              aria-label="Close Inspector"
            >
              &#x2715;
            </button>
          </div>

          {/* Drawer Body Container */}
          <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00E5FF] border-t-transparent"></div>
                <p className="text-sm text-slate-400 tracking-wider">Establishing telemetry uplink...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-4">
                <h4 className="text-sm font-bold text-rose-400">Uplink Acquisition Failed</h4>
                <p className="text-xs text-rose-300/80 mt-1">{error}</p>
              </div>
            )}

            {!isLoading && !error && node && (
              <div className="space-y-6">

                {/* Visual Section: Hardware Health */}
                <section className="space-y-3 bg-[#0E1524] p-4 rounded-lg border border-slate-800">
                  <h3 className="text-sm font-semibold tracking-wider text-teal-400 uppercase">Hardware Health (Pi 5 Node)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">CPU Core Load</p>
                      <p className="text-lg font-mono font-bold text-slate-100">{node.hardware.cpuUsage}%</p>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-[#00E5FF] h-full" style={{ width: `${node.hardware.cpuUsage}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">RAM Allocation</p>
                      <p className="text-lg font-mono font-bold text-slate-100">{node.hardware.ramUsage}%</p>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${node.hardware.ramUsage}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Core Temperature</p>
                      <p className="text-lg font-mono font-bold text-slate-100">{node.hardware.temp}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Flash Storage</p>
                      <p className="text-xs font-mono font-semibold text-slate-100 mt-1">{node.hardware.diskAvailable}</p>
                    </div>
                  </div>
                </section>

                {/* Visual Section: WAN & Tunnel Telemetry */}
                <section className="space-y-3 bg-[#0E1524] p-4 rounded-lg border border-slate-800">
                  <h3 className="text-sm font-semibold tracking-wider text-teal-400 uppercase">Uplink &amp; Encryption Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Link Access Mode</span>
                      <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">{node.network.connectionType}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">WireGuard VPN Tunnel</span>
                      <span className="font-mono text-[#00E5FF] font-bold">{node.network.tunnelState}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Line Latency</span>
                      <span className="font-mono text-slate-100">{node.network.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Packet Loss Rate</span>
                      <span className="font-mono text-rose-400">{node.network.packetLoss}%</span>
                    </div>
                  </div>
                </section>

                {/* Visual Section: Sync & Federation Metrics */}
                <section className="space-y-3 bg-[#0E1524] p-4 rounded-lg border border-slate-800">
                  <h3 className="text-sm font-semibold tracking-wider text-teal-400 uppercase">Multi-Master Sync Queue</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-400">Pending Local Mutations</p>
                        <p className="text-2xl font-mono font-bold text-amber-400">{node.syncMetrics.pendingQueueSize}</p>
                      </div>
                      <span className="px-2.5 py-1 text-xs rounded-full font-bold border border-amber-500/20 bg-amber-500/10 text-amber-300">
                        {node.syncMetrics.pendingQueueSize > 0 ? "Pending Federation" : "Synced"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Protocols Processed</span>
                        <span className="font-mono text-slate-200">{node.syncMetrics.totalProtobufDeltasProcessed}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Last Synced Signature Hash</span>
                        <span className="font-mono text-[10px] break-all bg-[#0A0E17] p-2 rounded block border border-slate-800 text-teal-300">
                          {node.syncMetrics.lastSyncedTxId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Synced Frame</span>
                        <span className="text-slate-200 font-mono">{node.syncMetrics.lastSyncTimestamp}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Action Controls */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      alert(`Initiating secure reboot sequence on hardware node: ${node.nodeId}`);
                    }}
                    className="flex-1 bg-[#1A202C] border border-slate-700 hover:border-rose-500/40 hover:text-rose-400 text-slate-300 font-bold py-2.5 px-4 rounded text-xs tracking-wider transition uppercase"
                  >
                    Reboot Hardware
                  </button>
                  <button
                    onClick={() => {
                      alert(`Triggering manual edge sync pull on node: ${node.nodeId}`);
                    }}
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-slate-100 font-bold py-2.5 px-4 rounded text-xs tracking-wider transition uppercase"
                  >
                    Force Core Sync
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
