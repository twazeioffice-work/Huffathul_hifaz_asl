import { 
  pgTable, uuid, text, timestamp, boolean, integer, pgEnum, decimal, date 
} from "drizzle-orm/pg-core";

// ============================================================================
// SUFFAT-UL HUFFAZ - ENUMS
// ============================================================================
export const roleEnum = pgEnum('user_role', [
  'SUPER_ADMIN', 
  'GLOBAL_JUNCTION', 
  'CENTER_ADMIN', 
  'NAZIM', 
  'USTAD', 
  'STUDENT', 
  'PARENT'
]);
export const complaintStatusEnum = pgEnum('complaint_status', ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED']);
export const transactionTypeEnum = pgEnum('transaction_type', ['INCOME', 'EXPENSE']);
export const attendanceEnum = pgEnum('attendance_status', ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

export const hifzPlanStatusEnum = pgEnum('hifz_plan_status', ['ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED']);
export const revisionTypeEnum = pgEnum('revision_type', ['SABQI', 'MANZIL', 'WEEKLY_REVISION', 'MONTHLY_REVISION']);
export const examTypeEnum = pgEnum('exam_type', ['MONTHLY_EXAM', 'JUZ_COMPLETION_EXAM', 'FINAL_HIFZ_EXAM', 'TAJWEED_EXAM', 'ANNUAL_EXAM']);
export const promotionStatusEnum = pgEnum('promotion_status', ['PENDING_REVIEW', 'APPROVED_BY_USTAD', 'APPROVED_BY_NAZIM', 'CERTIFICATE_ISSUED', 'ALUMNI']);


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

// ============================================================================
// 4. PERMISSIONS & ROLE MANAGEMENT
// ============================================================================
export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  module: text("module").notNull(),
  action: text("action").notNull(),
  description: text("description"),
});

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: roleEnum("role").notNull(),
  permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: 'cascade' }),
  isAllowed: boolean("is_allowed").default(true).notNull(),
});

export const userPermissionOverrides = pgTable("user_permission_overrides", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: 'cascade' }),
  isAllowed: boolean("is_allowed").notNull(),
  reason: text("reason"),
  grantedBy: uuid("granted_by").references(() => users.id, { onDelete: 'set null' }),
  expiresAt: timestamp("expires_at"),
});

export const globalJunctionMappings = pgTable("global_junction_mappings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: 'cascade' }), // null = all centers
  scope: text("scope").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});


// ============================================================================
// PHASE 2: ACADEMIC ENGINE EXPANSION
// ============================================================================

export const studentHifzPlans = pgTable("student_hifz_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentEnrollmentId: uuid("student_enrollment_id").notNull(),
  targetJuz: integer("target_juz").notNull(),
  targetCompletionDate: date("target_completion_date"),
  dailyNewPages: decimal("daily_new_pages"),
  dailyRevisionPages: decimal("daily_revision_pages"),
  assignedUstadId: uuid("assigned_ustad_id").notNull().references(() => users.id, { onDelete: 'set null' }),
  status: hifzPlanStatusEnum("status").default('ACTIVE').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sabaqMistakes = pgTable("sabaq_mistakes", {
  id: uuid("id").primaryKey().defaultRandom(),
  hifzSabaqRecordId: uuid("hifz_sabaq_record_id").notNull(),
  mistakeType: text("mistake_type").notNull(), // e.g. Lahn Jali, Lahn Khafi
  pageNumber: integer("page_number").notNull(),
  ayahReference: text("ayah_reference").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revisionSchedules = pgTable("revision_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentEnrollmentId: uuid("student_enrollment_id").notNull(),
  scheduleDate: date("schedule_date").notNull(),
  revisionType: revisionTypeEnum("revision_type").notNull(),
  juzNumber: integer("juz_number"),
  pageStart: integer("page_start"),
  pageEnd: integer("page_end"),
  status: text("status").default('PENDING').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  academicTermId: uuid("academic_term_id"),
  examType: examTypeEnum("exam_type").notNull(),
  examDate: date("exam_date").notNull(),
  subject: text("subject").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examResults = pgTable("exam_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: 'cascade' }),
  studentEnrollmentId: uuid("student_enrollment_id").notNull(),
  score: decimal("score"),
  grade: text("grade"),
  evaluatorId: uuid("evaluator_id").notNull().references(() => users.id, { onDelete: 'set null' }),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// ==========================================
// PHASE 3: FINANCE ENGINE
// ==========================================

export const feeFrequencyEnum = pgEnum("fee_frequency", ["MONTHLY", "QUARTERLY", "ANNUAL", "ONE_TIME"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"]);
export const paymentMethodEnum = pgEnum("payment_method", ["CASH", "BANK_TRANSFER", "CARD", "ONLINE_GATEWAY", "SPONSORSHIP", "WAIVER"]);
export const waiverTypeEnum = pgEnum("waiver_type", ["FULL_WAIVER", "PARTIAL_WAIVER", "ORPHAN_SCHOLARSHIP", "SPONSORSHIP_COVERED", "TEMPORARY_RELIEF"]);
export const sponsorshipStatusEnum = pgEnum("sponsorship_status", ["ACTIVE", "PENDING_PAYMENT", "PAUSED", "CANCELLED", "COMPLETED"]);
export const accountingPeriodStatusEnum = pgEnum("accounting_period_status", ["OPEN", "CLOSED", "LOCKED"]);
export const expenseRequestStatusEnum = pgEnum("expense_request_status", ["REQUESTED", "APPROVED", "REJECTED", "PAID"]);

export const feeStructures = pgTable("fee_structures", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  programType: text("program_type").notNull(),
  feeHead: text("fee_head").notNull(),
  amount: decimal("amount").notNull(),
  frequency: feeFrequencyEnum("frequency").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  studentEnrollmentId: uuid("student_enrollment_id").notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  feeHeadId: uuid("fee_head_id").notNull().references(() => feeStructures.id),
  amount: decimal("amount").notNull(),
  dueDate: date("due_date").notNull(),
  status: invoiceStatusEnum("status").default('DRAFT').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const receipts = pgTable("receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  amount: decimal("amount").notNull(),
  receivedBy: uuid("received_by").notNull().references(() => users.id),
  receiptDate: timestamp("receipt_date").defaultNow().notNull(),
  referenceNumber: text("reference_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feeWaivers = pgTable("fee_waivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentEnrollmentId: uuid("student_enrollment_id").notNull(),
  waiverType: waiverTypeEnum("waiver_type").notNull(),
  percentage: decimal("percentage"),
  amount: decimal("amount"),
  approvedBy: uuid("approved_by").notNull().references(() => users.id),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentSponsorships = pgTable("student_sponsorships", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentEnrollmentId: uuid("student_enrollment_id").notNull(),
  sponsorName: text("sponsor_name").notNull(),
  sponsorPhone: text("sponsor_phone"),
  sponsorEmail: text("sponsor_email"),
  sponsorshipStatus: sponsorshipStatusEnum("sponsorship_status").default('ACTIVE').notNull(),
  nextDueDate: date("next_due_date"),
  lastPaymentDate: date("last_payment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accountingPeriods = pgTable("accounting_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  periodName: text("period_name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: accountingPeriodStatusEnum("status").default('OPEN').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  accountHeadId: text("account_head_id").notNull(),
  periodId: uuid("period_id").notNull().references(() => accountingPeriods.id, { onDelete: 'cascade' }),
  budgetAmount: decimal("budget_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenseRequests = pgTable("expense_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  requestedBy: uuid("requested_by").notNull().references(() => users.id),
  amount: decimal("amount").notNull(),
  purpose: text("purpose").notNull(),
  status: expenseRequestStatusEnum("status").default('REQUESTED').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// PHASE 4: HR AND PAYROLL ENGINE
// ==========================================

export const attendanceStatusEnum = pgEnum("attendance_status", ["PRESENT", "ABSENT", "LEAVE", "HALF_DAY", "LATE"]);
export const leaveStatusEnum = pgEnum("leave_status", ["REQUESTED", "APPROVED", "REJECTED", "CANCELLED"]);
export const payrollStatusEnum = pgEnum("payroll_status", ["DRAFT", "PENDING_APPROVAL", "APPROVED", "PAID"]);

export const staffAttendance = pgTable("staff_attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffProfileId: uuid("staff_profile_id").notNull(),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").default('PRESENT').notNull(),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staffLeaves = pgTable("staff_leaves", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffProfileId: uuid("staff_profile_id").notNull(),
  leaveType: text("leave_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason").notNull(),
  status: leaveStatusEnum("status").default('REQUESTED').notNull(),
  approvedBy: uuid("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staffContracts = pgTable("staff_contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffProfileId: uuid("staff_profile_id").notNull(),
  contractStart: date("contract_start").notNull(),
  contractEnd: date("contract_end"),
  salary: decimal("salary").notNull(),
  terms: text("terms"),
  documentId: text("document_id"),
  renewalReminderDate: date("renewal_reminder_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const salaryStructures = pgTable("salary_structures", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffProfileId: uuid("staff_profile_id").notNull(),
  basicSalary: decimal("basic_salary").notNull(),
  allowances: decimal("allowances").default('0').notNull(),
  deductions: decimal("deductions").default('0').notNull(),
  overtimeRate: decimal("overtime_rate").default('0').notNull(),
  effectiveDate: date("effective_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payrollRuns = pgTable("payroll_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  month: text("month").notNull(),
  status: payrollStatusEnum("status").default('DRAFT').notNull(),
  approvedBy: uuid("approved_by").references(() => users.id),
  paymentDate: date("payment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staffReviews = pgTable("staff_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffProfileId: uuid("staff_profile_id").notNull(),
  reviewPeriod: text("review_period").notNull(),
  reviewedBy: uuid("reviewed_by").notNull().references(() => users.id),
  performanceScore: decimal("performance_score"),
  remarks: text("remarks"),
  pagesTaught: text("pages_taught"),
  studentGpaTrend: text("student_gpa_trend"),
  attendanceCompletion: text("attendance_completion"),
  pendingEntries: text("pending_entries"),
  behaviorFeedback: text("behavior_feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// PHASE 5: NOTIFICATION ENGINE
// ==========================================

export const notificationTypeEnum = pgEnum("notification_type", [
  "WELFARE_CASE_CREATED", "WELFARE_CASE_APPEALED", "HQ_DIRECTIVE", "SLA_BREACH", 
  "FEE_REMINDER", "WHATSAPP_MESSAGE", "SYNC_COMPLETED", "SYSTEM_ALERT", 
  "APPROVAL_REQUEST", "PAYMENT_RECEIVED", "ATTENDANCE_ALERT", "REPORT_READY"
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  institutionId: uuid("institution_id").notNull().references(() => institutions.id, { onDelete: 'cascade' }),
  branchId: uuid("branch_id").notNull().references(() => centers.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: notificationTypeEnum("type").notNull(),
  link: text("link"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  notificationType: notificationTypeEnum("notification_type").notNull(),
  inApp: boolean("in_app").default(true).notNull(),
  whatsapp: boolean("whatsapp").default(false).notNull(),
  email: boolean("email").default(true).notNull(),
  push: boolean("push").default(true).notNull(),
});

// ==========================================
// PHASE 6: ANNOUNCEMENT / NOTICE BOARD SYSTEM
// ==========================================

export const announcementAudienceEnum = pgEnum("announcement_audience", [
  "ALL", "STUDENTS", "PARENTS", "STAFF", "USTADS", "SPECIFIC_BATCH", "SPECIFIC_BRANCH"
]);

export const announcementCategoryEnum = pgEnum("announcement_category", [
  "GENERAL", "ACADEMIC", "EXAM", "LEAVE", "EVENT", "URGENT", "FINANCE"
]);

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  institutionId: uuid("institution_id").notNull().references(() => institutions.id, { onDelete: 'cascade' }),
  branchId: uuid("branch_id").references(() => centers.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  category: announcementCategoryEnum("category").default('GENERAL').notNull(),
  audience: announcementAudienceEnum("audience").default('ALL').notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date"),
  priority: boolean("priority").default(false).notNull(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  attachmentId: text("attachment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// ADVANCED PHASE 1: CORE SECURITY HARDENING
// ==========================================

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text("token_hash").notNull(),
  deviceInfo: text("device_info"),
  ipAddress: text("ip_address"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  institutionId: uuid("institution_id").references(() => institutions.id),
  branchId: uuid("branch_id").references(() => centers.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  ipAddress: text("ip_address"),
  deviceInfo: text("device_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
