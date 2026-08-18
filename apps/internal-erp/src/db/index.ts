import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import schema from './schema'
import Student from './models/Student'
// import Staff from './models/Staff'

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  onQuotaExceededError: (error) => {
    console.error('WatermelonDB quota exceeded', error)
  },
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error', error)
  },
  extraLokiOptions: {
    autosave: true,
    autosaveInterval: 1000,
  },
})

export const database = new Database({
  adapter,
  modelClasses: [
    Student,
    // Staff,
  ],
})
