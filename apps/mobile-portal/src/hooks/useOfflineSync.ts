import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true); // Default true, would link to NetInfo in prod
  const [pendingQueueLength, setPendingQueueLength] = useState(0);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  const checkQueueLength = useCallback(async () => {
    try {
      const queueStr = await AsyncStorage.getItem('@offline_mutation_queue');
      if (queueStr) {
        const queue = JSON.parse(queueStr);
        setPendingQueueLength(queue.length || 0);
      }
    } catch (e) {
      console.error("Failed to check queue length", e);
    }
  }, []);

  const triggerManualSync = useCallback(async () => {
    if (!isOnline) {
      console.warn("Cannot sync while offline.");
      return;
    }
    
    // Process queue (simulated)
    try {
      const queueStr = await AsyncStorage.getItem('@offline_mutation_queue');
      if (queueStr) {
        const queue = JSON.parse(queueStr);
        // ... Send to backend mutex API here ...
        console.log(`Syncing ${queue.length} items...`);
        await AsyncStorage.removeItem('@offline_mutation_queue');
      }
      setPendingQueueLength(0);
      setLastSyncedTime(new Date().toISOString());
    } catch (e) {
      console.error("Sync failed", e);
    }
  }, [isOnline]);

  useEffect(() => {
    checkQueueLength();
    // In a real app, subscribe to NetInfo changes here to update `isOnline`
  }, [checkQueueLength]);

  return {
    isOnline,
    pendingQueueLength,
    lastSyncedTime,
    triggerManualSync
  };
}
