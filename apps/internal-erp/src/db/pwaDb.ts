import Dexie, { type Table } from "dexie";

// Types matching backend models and UI state
export interface LocalSabaqDraft {
  id: string; // UUID (generated locally or on server)
  studentEnrollmentId: string;
  juzNumber: number;
  pageStart: number;
  pageEnd: number;
  grade: "MUMTAZ" | "JAYYID" | "MAQBUL" | "DAIF";
  teacherNotes?: string;
  lastModifiedAt: string; // ISO String
  synced: 0 | 1; // 0 = Dirty/Queue, 1 = Synced
}

export interface LocalAttendanceDraft {
  id: string; // studentEnrollmentId_date compound unique key
  studentEnrollmentId: string;
  date: string; // YYYY-MM-DD
  fajr: "PRESENT" | "LATE" | "ABSENT";
  dhuhr: "PRESENT" | "LATE" | "ABSENT";
  asr: "PRESENT" | "LATE" | "ABSENT";
  maghrib: "PRESENT" | "LATE" | "ABSENT";
  isha: "PRESENT" | "LATE" | "ABSENT";
  lastModifiedAt: string;
  synced: 0 | 1;
}

export interface SyncMetadata {
  key: string; // e.g., 'last_pulled_at'
  value: string; // ISO Timestamp or Token
}

class SuffatLocalDatabase extends Dexie {
  sabaqDrafts!: Table<LocalSabaqDraft, string>;
  attendanceDrafts!: Table<LocalAttendanceDraft, string>;
  syncMeta!: Table<SyncMetadata, string>;

  constructor() {
    super("SuffatLocalDatabase");
    
    // Schema definition. Indexing key lookup parameters for fast UI rendering.
    this.version(1).stores({
      sabaqDrafts: "id, studentEnrollmentId, synced, lastModifiedAt",
      attendanceDrafts: "id, studentEnrollmentId, date, synced",
      syncMeta: "key"
    });
  }
}

export const pwaDb = new SuffatLocalDatabase();
