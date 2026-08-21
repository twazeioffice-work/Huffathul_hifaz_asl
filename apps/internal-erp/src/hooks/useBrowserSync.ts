"use client";

import { useState, useEffect, useCallback } from "react";
import { pwaDb, type LocalSabaqDraft, type LocalAttendanceDraft } from "../db/pwaDb";

export type SyncStatusState = "SYNCED" | "DIRTY" | "SYNCING" | "OFFLINE" | "ERROR";

export const useBrowserSync = (branchId: string, sessionToken: string) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>("SYNCED");
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Monitor hardware network interface connectivity
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("OFFLINE");
    };

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check if there are unsynced changes queued in IndexedDB
  const checkQueueStatus = useCallback(async () => {
    if (!isOnline) {
      setSyncStatus("OFFLINE");
      return;
    }
    const unsyncedSabaq = await pwaDb.sabaqDrafts.where("synced").equals(0).count();
    const unsyncedAttendance = await pwaDb.attendanceDrafts.where("synced").equals(0).count();

    if (unsyncedSabaq > 0 || unsyncedAttendance > 0) {
      setSyncStatus("DIRTY");
    } else {
      setSyncStatus("SYNCED");
    }
  }, [isOnline]);

  useEffect(() => {
    checkQueueStatus();
  }, [checkQueueStatus]);

  // Execute Bidirectional Delta-Sync Handshake (LWW Conflict Resolution)
  const executeSync = useCallback(async () => {
    if (!isOnline) {
      setError("Cannot sync: device is currently offline.");
      setSyncStatus("OFFLINE");
      return;
    }

    setSyncStatus("SYNCING");
    setError(null);

    try {
      // 1. Gather Unsynced Drafts from local tables
      const dirtySabaq = await pwaDb.sabaqDrafts.where("synced").equals(0).toArray();
      const dirtyAttendance = await pwaDb.attendanceDrafts.where("synced").equals(0).toArray();

      // Retrieve Last Pulled timestamp from sync metadata
      const lastPulledMeta = await pwaDb.syncMeta.get("last_pulled_at");
      const lastPulledAt = lastPulledMeta?.value || "1970-01-01T00:00:00.000Z";

      // 2. Dispatch Push Payload to FastAPI Controller
      const response = await fetch(`/api/v1/sync/push-pull`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          branch_id: branchId,
          last_pulled_at: lastPulledAt,
          sabaq_updates: dirtySabaq.map(({ synced, ...rest }) => rest),
          attendance_updates: dirtyAttendance.map(({ synced, ...rest }) => rest),
        }),
      });

      if (!response.ok) {
        throw new Error(`Sync Server returned status: ${response.status}`);
      }

      const syncResult = await response.json();
      // Server returns: { server_time: string, sabaq_deltas: Array, attendance_deltas: Array }

      // 3. Update Local Storage with Server Deltas (Last-Write-Wins Resolution)
      await pwaDb.transaction("rw", [pwaDb.sabaqDrafts, pwaDb.attendanceDrafts, pwaDb.syncMeta], async () => {
        
        // Mark pushed dirty records as Synced
        if (dirtySabaq.length > 0) {
          const sabaqIds = dirtySabaq.map(item => item.id);
          await pwaDb.sabaqDrafts.where("id").anyOf(sabaqIds).modify({ synced: 1 });
        }
        if (dirtyAttendance.length > 0) {
          const attendanceIds = dirtyAttendance.map(item => item.id);
          await pwaDb.attendanceDrafts.where("id").anyOf(attendanceIds).modify({ synced: 1 });
        }

        // Apply Server Deltas downstream
        for (const delta of syncResult.sabaq_deltas) {
          const localItem = await pwaDb.sabaqDrafts.get(delta.id);
          
          // Only update if server is newer than local (LWW Protection)
          if (!localItem || new Date(delta.lastModifiedAt) > new Date(localItem.lastModifiedAt)) {
            await pwaDb.sabaqDrafts.put({
              ...delta,
              synced: 1 // Server authoritative
            });
          }
        }

        for (const delta of syncResult.attendance_deltas) {
          const localItem = await pwaDb.attendanceDrafts.get(delta.id);
          if (!localItem || new Date(delta.lastModifiedAt) > new Date(localItem.lastModifiedAt)) {
            await pwaDb.attendanceDrafts.put({
              ...delta,
              synced: 1
            });
          }
        }

        // Update the Sync Anchor Time stamp
        await pwaDb.syncMeta.put({ key: "last_pulled_at", value: syncResult.server_time });
      });

      const now = new Date().toLocaleTimeString();
      setLastSyncTime(now);
      setSyncStatus("SYNCED");
    } catch (err: any) {
      console.error("Critical Sync Failure:", err);
      setError(err.message || "Failed to execute bidirectional handshake.");
      setSyncStatus("ERROR");
    }
  }, [isOnline, branchId, sessionToken]);

  // Queue changes locally inside the browser when offline or active
  const saveSabaqDraft = async (draft: Omit<LocalSabaqDraft, "synced" | "lastModifiedAt">) => {
    const updatedDraft: LocalSabaqDraft = {
      ...draft,
      lastModifiedAt: new Date().toISOString(),
      synced: 0 // Flagged as dirty
    };
    await pwaDb.sabaqDrafts.put(updatedDraft);
    await checkQueueStatus();
  };

  const saveAttendanceDraft = async (draft: Omit<LocalAttendanceDraft, "synced" | "lastModifiedAt">) => {
    const updatedDraft: LocalAttendanceDraft = {
      ...draft,
      lastModifiedAt: new Date().toISOString(),
      synced: 0 // Flagged as dirty
    };
    await pwaDb.attendanceDrafts.put(updatedDraft);
    await checkQueueStatus();
  };

  return {
    syncStatus,
    lastSyncTime,
    isOnline,
    error,
    executeSync,
    saveSabaqDraft,
    saveAttendanceDraft
  };
};
