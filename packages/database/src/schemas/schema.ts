import { 
  pgTable, uuid, text, timestamp, boolean, integer, pgEnum, decimal 
} from "drizzle-orm/pg-core";

// ============================================================================
// SUFFAT-UL HUFFAZ - ENUMS
// ============================================================================
export const roleEnum = pgEnum('user_role', ['SUPER_ADMIN', 'NAZIM', 'USTAD', 'STUDENT']);
export const complaintStatusEnum = pgEnum('complaint_status', ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED']);
export const transactionTypeEnum = pgEnum('transaction_type', ['INCOME', 'EXPENSE']);
export const attendanceEnum = pgEnum('attendance_status', ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

// ============================================================================
// 1. GLOBAL TABLES (Cross-Tenant)
// ============================================================================
export const centers = pgTable("centers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location"),
  whatsappApiKey: text("whatsapp_api_key"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id), // Nullable for Super Admins
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  role: roleEnum("role").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// 2. TENANT-SCOPED TABLES (RLS Enforced via center_id)
// ============================================================================
export const halqas = pgTable("halqas", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").notNull().references(() => centers.id),
  ustadId: uuid("ustad_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").notNull().references(() => centers.id),
  halqaId: uuid("halqa_id").notNull().references(() => halqas.id),
  name: text("name").notNull(),
  enrollmentId: text("enrollment_id").notNull().unique(),
  parentPhone: text("parent_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyLogs = pgTable("daily_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").notNull().references(() => centers.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  halqaId: uuid("halqa_id").notNull().references(() => halqas.id),
  ustadId: uuid("ustad_id").notNull().references(() => users.id),
  date: timestamp("date", { mode: 'date' }).notNull(),
  attendance: attendanceEnum("attendance").notNull(),
  hifzSabaq: text("hifz_sabaq"),
  hifzSabqi: text("hifz_sabqi"),
  hifzManzil: text("hifz_manzil"),
  prayersLogged: integer("prayers_logged").default(0), // Fajr, Dhuhr, Asr, Maghrib, Isha
  adabScore: integer("adab_score").default(100), // Disciplinary scoring
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// 3. FINANCIAL & ESCALATION SYSTEMS
// ============================================================================
export const financialLedger = pgTable("financial_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").notNull().references(() => centers.id),
  loggedById: uuid("logged_by_id").notNull().references(() => users.id), // Must be Nazim or Super Admin
  type: transactionTypeEnum("type").notNull(),
  category: text("category").notNull(), // 'Tuition', 'Sadaqah', 'Kitchen', 'Payroll'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
});

export const complaints = pgTable("complaints", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").notNull().references(() => centers.id),
  submittedById: uuid("submitted_by_id"), // NULL if anonymous!
  againstUserId: uuid("against_user_id").references(() => users.id), // Direct-to-Admin triggers
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: complaintStatusEnum("status").default('OPEN').notNull(),
  severity: text("severity").default('NORMAL').notNull(), // 'NORMAL', 'SEVERE'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
