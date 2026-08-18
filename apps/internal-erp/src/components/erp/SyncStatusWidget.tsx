"use client";

import { useOfflineSync } from "@/hooks/useOfflineSync";
import { useResponsive } from "@/hooks/useResponsive";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncStatusWidget() {
  const { isOnline, syncState, queueLength, lastSyncTime, forceSync } = useOfflineSync();
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <button 
        onClick={forceSync}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          isOnline ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}
        title={syncState === "syncing" ? "Syncing database changes..." : "Sync status"}
      >
        {syncState === "syncing" ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <div className="glass-panel rounded-lg p-4 space-y-3">
      {/* Network Status Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DATABASE SYNC</span>
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "h-2 w-2 rounded-full",
            isOnline ? "bg-success animate-pulse-glow" : "bg-destructive"
          )} />
          <span className="text-xs font-medium">{isOnline ? "Online" : "Offline Mode"}</span>
        </div>
      </div>

      {/* Sync Queue Metadata */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Pending Queue</span>
          <span className={cn("font-mono font-semibold", queueLength > 0 ? "text-warning" : "text-success")}>
            {queueLength} updates
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Last Synced</span>
          <span className="text-muted-foreground font-mono">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : "Never"}
          </span>
        </div>
      </div>

      {/* Execution Actions */}
      <button
        onClick={forceSync}
        disabled={syncState === "syncing" || !isOnline}
        className={cn(
          "w-full h-8 flex items-center justify-center gap-2 rounded text-xs font-medium focus-ring transition-colors",
          syncState === "syncing" 
            ? "bg-slate-800 text-slate-400 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-accent-hover"
        )}
      >
        <RefreshCw className={cn("h-3.5 w-3.5", syncState === "syncing" && "animate-spin")} />
        {syncState === "syncing" ? "Synchronizing..." : "Sync Now"}
      </button>

      {/* Warning State Indicator */}
      {queueLength > 20 && (
        <div className="flex items-start gap-1.5 rounded-md bg-warning/10 p-2 text-[10px] text-warning">
          <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
          <span>Local storage holds a significant backlog of edits. Verify connectivity.</span>
        </div>
      )}
    </div>
  );
}
