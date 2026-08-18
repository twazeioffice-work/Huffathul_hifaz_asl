import { useState, useEffect } from "react";

export type SyncState = "idle" | "syncing" | "failed" | "success";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [queueLength, setQueueLength] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    // Mock connection to local WatermelonDB sync stream / triggers
    const interval = setInterval(() => {
      // In production, query WatermelonDB: database.collections.get('...').query(Q.where('_status', 'created')).fetch()
      setQueueLength((prev) => (Math.random() > 0.85 ? Math.max(0, prev + Math.floor(Math.random() * 3) - 1) : prev));
    }, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const forceSync = async () => {
    if (!isOnline || syncState === "syncing") return;

    setSyncState("syncing");
    try {
      // Perform API call matching Phase 2 Sync endpoints
      // await database.synchronize({ pullChanges: ..., pushChanges: ... })
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setQueueLength(0);
      setLastSyncTime(new Date().toISOString());
      setSyncState("success");
    } catch (err) {
      setSyncState("failed");
    } finally {
      setTimeout(() => setSyncState("idle"), 3000);
    }
  };

  return { isOnline, syncState, queueLength, lastSyncTime, forceSync };
}
