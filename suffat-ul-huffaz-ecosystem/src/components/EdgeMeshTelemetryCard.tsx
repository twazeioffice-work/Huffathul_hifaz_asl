"use client";

import React from "react";
import { useEdgeTelemetryInspector } from "../hooks/useEdgeTelemetryInspector";
import EdgeNodeInspectorDrawer from "./EdgeNodeInspectorDrawer";

export default function EdgeMeshTelemetryCard() {
  const {
    isDrawerOpen,
    activeNode,
    isLoading,
    error,
    openInspector,
    closeInspector,
  } = useEdgeTelemetryInspector();

  // Mock initial list of deployed physical edge nodes across India
  const nodes = [
    { id: "EDGENODE-KL-04", location: "Kerala Central Campus (Kozhikode)", status: "ONLINE", queue: 0, link: "SATELLITE" },
    { id: "EDGENODE-UP-09", location: "Lucknow Rural Branch (UP)", status: "SYNCING", queue: 42, link: "CELLULAR" },
    { id: "EDGENODE-KA-12", location: "Bengaluru Main Campus (Jayanagar)", status: "ONLINE", queue: 0, link: "BROADBAND" },
    { id: "EDGENODE-JK-01", location: "Srinagar Edge Facility (J&K)", status: "DEGRADED", queue: 119, link: "SATELLITE" },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0E1524] p-6 shadow-md text-slate-100 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          📡 Edge Mesh Node Real-time Telemetry
        </h3>
        <span className="text-xs bg-[#1A202C] text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full font-mono">
          4 Active WireGuard Mesh Nodes
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] tracking-wider uppercase font-mono">
              <th className="py-3 px-4">Node ID</th>
              <th className="py-3 px-4">Branch Location</th>
              <th className="py-3 px-4">Mesh Link</th>
              <th className="py-3 px-4">Local Sync Queue</th>
              <th className="py-3 px-4">Telemetry Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {nodes.map((node) => (
              <tr key={node.id} className="hover:bg-slate-800/20 transition group">
                <td className="py-3.5 px-4 font-mono">
                  <button
                    onClick={() => openInspector(node.id)}
                    className="text-left text-slate-200 group-hover:text-[#00E5FF] group-hover:underline transition flex items-center gap-1.5 focus:outline-none font-bold"
                    title="Click to trace live telemetry metrics"
                  >
                    <span>{node.id}</span>
                    <svg
                      className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition text-[#00E5FF] inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </td>
                <td className="py-3.5 px-4 text-slate-300">{node.location}</td>
                <td className="py-3.5 px-4 text-slate-400 font-mono">{node.link}</td>
                <td className="py-3.5 px-4 font-mono">
                  <span className={node.queue > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                    {node.queue} deltas
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    node.status === "ONLINE" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" :
                    node.status === "SYNCING" ? "bg-amber-950/40 text-amber-400 border border-amber-500/20" :
                    "bg-rose-950/40 text-rose-400 border border-rose-500/20"
                  }`}>
                    {node.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => openInspector(node.id)}
                    className="px-2.5 py-1 rounded bg-teal-950/80 border border-teal-500/40 text-[#00E5FF] text-[10px] font-bold hover:bg-[#00E5FF] hover:text-slate-950 transition"
                  >
                    Inspect &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Inspector drawer */}
      <EdgeNodeInspectorDrawer
        isOpen={isDrawerOpen}
        isLoading={isLoading}
        error={error}
        node={activeNode}
        onClose={closeInspector}
      />
    </div>
  );
}
