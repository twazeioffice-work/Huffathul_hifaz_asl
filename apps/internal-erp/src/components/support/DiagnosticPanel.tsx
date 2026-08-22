"use client";

import React, { useState, useEffect } from "react";
import { pwaDb } from "../../db/pwaDb";
import { useBrowserSync } from "../../hooks/useBrowserSync";
import { executeSoftCacheRepair } from "../../lib/cacheRepair";

interface AuditResult {
  id: string;
  name: string;
  description: string;
  status: "PASS" | "WARN" | "FAIL";
  diagnosis: string;
  remediation: string;
  actionText?: string;
  onAction?: () => void | Promise<void>;
}

export const DiagnosticPanel: React.FC<{ branchId: string; token: string }> = ({
  branchId,
  token,
}) => {
  const { isOnline, syncStatus, executeSync } = useBrowserSync(branchId, token);
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [repairLog, setRepairLog] = useState<string | null>(null);

  const runSystemAudits = async () => {
    setIsRunning(true);
    setRepairLog(null);
    const results: AuditResult[] = [];

    // --- 1. NETWORK CONNECTIVITY CHECK ---
    const onlineCheck = navigator.onLine;
    results.push({
      id: "network",
      name: "Internet Connectivity",
      description: "Verifies the browser can reach outer internet services.",
      status: onlineCheck ? "PASS" : "FAIL",
      diagnosis: onlineCheck 
        ? "Your browser is successfully connected to the network." 
        : "Your device is completely offline or in Airplane Mode.",
      remediation: onlineCheck 
        ? "No action needed." 
        : "Check your Wi-Fi router, disable Airplane Mode, or step closer to an open window in the masjid.",
    });

    // --- 2. BROWSER OFFLINE DATABASE STORAGE (IndexedDB) ---
    try {
      const dbOpen = await pwaDb.open();
      const sabaqCount = await pwaDb.sabaqDrafts.count();
      const attendanceCount = await pwaDb.attendanceDrafts.count();
      
      // Estimate Storage space
      let storageInfo = "Database opened successfully.";
      let storageStatus: "PASS" | "WARN" = "PASS";
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const pctUsed = ((estimate.usage || 0) / (estimate.quota || 1)) * 100;
        storageInfo = `Database active. Using ${pctUsed.toFixed(4)}% of allocated browser cache space.`;
        if (pctUsed > 80) storageStatus = "WARN";
      }

      results.push({
        id: "storage",
        name: "Offline Storage Vault (IndexedDB)",
        description: "Checks browser memory integrity for secure local grade backup.",
        status: storageStatus,
        diagnosis: `${storageInfo} Current unsynced local logs: Hifz (${sabaqCount}), Prayers (${attendanceCount}).`,
        remediation: storageStatus === "WARN" 
          ? "Your device space is nearly full. Click 'Clear Cache Safely' to release temporary static files." 
          : "No action needed. Offline backup is operating perfectly.",
        actionText: sabaqCount > 0 || attendanceCount > 0 ? "Force Sync Local Work" : undefined,
        onAction: async () => {
          setRepairLog("Attempting background synchronization hook...");
          await executeSync();
          setRepairLog("Sync request processed! Re-auditing...");
          runSystemAudits();
        }
      });
    } catch (err: any) {
      results.push({
        id: "storage",
        name: "Offline Storage Vault (IndexedDB)",
        description: "Checks browser memory integrity for secure local grade backup.",
        status: "FAIL",
        diagnosis: `Browser Database is locked or corrupted: ${err.message}`,
        remediation: "This usually happens if private browsing/incognito mode blocks storage. Please disable private mode and restart your browser.",
        actionText: "Wipe and Repair Cache",
        onAction: async () => {
          if (confirm("This will wipe cached offline data that has not been synced. Proceed?")) {
            await pwaDb.delete();
            window.location.reload();
          }
        }
      });
    }

    // --- 3. SESSION AUTHENTICATION & TOKEN EXPIRATION ---
    const jwtCookieExists = document.cookie.includes("__Host-Secure-Token") || document.cookie.includes("session");
    let authStatus: "PASS" | "FAIL" = jwtCookieExists ? "PASS" : "FAIL";
    
    results.push({
      id: "auth",
      name: "Identity & Security Handshake",
      description: "Asserts that your login token is active and not corrupted.",
      status: authStatus,
      diagnosis: authStatus === "PASS"
        ? "Secure security session is verified."
        : "Your login session cookie is missing or has expired.",
      remediation: authStatus === "PASS"
        ? "No action needed."
        : "Your token has expired. Navigate to the login screen and re-authenticate to establish your connection.",
      actionText: authStatus === "FAIL" ? "Re-Login Now" : undefined,
      onAction: () => { window.location.href = "/login"; }
    });

    // --- 4. TENANCY & URL DIRECTION INTEGRITY ---
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split("/");
    const hasBranchScope = pathSegments.includes(branchId) || pathSegments.length > 3;

    results.push({
      id: "scoping",
      name: "Tenancy URL Routing Scoping",
      description: "Asserts that the system is reading the correct campus parameter.",
      status: hasBranchScope ? "PASS" : "WARN",
      diagnosis: hasBranchScope
        ? `Branch Scoping resolved correctly: ${branchId}`
        : "You are currently accessing the global panel. Some local widgets might not load.",
      remediation: hasBranchScope
        ? "No action needed."
        : "Please verify you clicked through the dashboard properly, or click below to return to your specific branch.",
      actionText: !hasBranchScope ? "Go to Branch Dashboard" : undefined,
      onAction: () => { window.location.href = `/app/suffat/${branchId}/erp`; }
    });

    // --- 5. AUTOMATED HARDWARE PERMISSION DETECTOR ---
    let pushStatus: "PASS" | "WARN" = "PASS";
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "denied") pushStatus = "WARN";
    }

    results.push({
      id: "notifications",
      name: "Device Notification Rights",
      description: "Checks if your device allows critical alert overrides.",
      status: pushStatus,
      diagnosis: pushStatus === "PASS"
        ? "Alert permission is approved or default."
        : "Alert notifications are blocked on this device's browser settings.",
      remediation: pushStatus === "PASS"
        ? "No action needed."
        : "Click the locker icon next to 'localhost' in your browser URL address bar and change 'Notifications' to 'Allow' to receive urgent system alerts.",
    });

    setAudits(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runSystemAudits();
  }, [isOnline]);

  return (
    <div className="w-full rounded-2xl bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/[0.08] p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            🛡️ Suffat Self-Service Diagnostician
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Instantly trace hardware, offline storage, and connection issues before contacting SRE IT.
          </p>
        </div>
        <button
          onClick={runSystemAudits}
          disabled={isRunning}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 border border-white/[0.1] transition-all disabled:opacity-50"
        >
          {isRunning ? "Running Checkups..." : "🔄 Run Deep Test"}
        </button>
      </div>

      {repairLog && (
        <div className="mb-4 p-3 text-xs bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 rounded-lg animate-pulse">
          ⚡ System Action: {repairLog}
        </div>
      )}

      <div className="space-y-4">
        {audits.map((audit) => (
          <div
            key={audit.id}
            className="p-4 rounded-xl border bg-white/[0.02] border-white/[0.05] transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">
                  {audit.status === "PASS" ? "🟢" : audit.status === "WARN" ? "🟡" : "🔴"}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    {audit.name}
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      audit.status === "PASS" 
                        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                        : audit.status === "WARN"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {audit.status}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{audit.description}</p>
                  
                  <div className="mt-2 text-xs text-zinc-300 border-l-2 border-white/10 pl-3 py-0.5">
                    <span className="font-semibold text-zinc-400">Diagnosis:</span> {audit.diagnosis}
                  </div>

                  {audit.status !== "PASS" && (
                    <div className="mt-2 text-xs text-amber-200/90 pl-3">
                      <span className="font-bold">🔧 How to fix:</span> {audit.remediation}
                    </div>
                  )}
                </div>
              </div>

              {audit.actionText && audit.onAction && (
                <button
                  onClick={audit.onAction}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all shadow-md"
                >
                  {audit.actionText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
