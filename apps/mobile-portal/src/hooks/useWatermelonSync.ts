import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from '../database'
import { apiClient } from '../apiClient' // Mutex-wrapped API client

export async function useWatermelonSync() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      // Normalize timestamp to Unix seconds if not null
      const timestamp = lastPulledAt ? Math.floor(lastPulledAt / 1000) : null
      
      const response = await apiClient.get(`/api/v1/sync?lastPulledAt=${timestamp || ''}`)
      if (!response.ok) {
        throw new Error('Failed to pull changes')
      }
      
      const { changes, timestamp: serverTimestamp } = await response.json()
      return { changes, timestamp: serverTimestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await apiClient.post('/api/v1/sync', {
        changes,
        lastPulledAt: lastPulledAt ? Math.floor(lastPulledAt / 1000) : null
      })
      if (!response.ok) {
        throw new Error('Failed to push changes')
      }
    },
  })
}
