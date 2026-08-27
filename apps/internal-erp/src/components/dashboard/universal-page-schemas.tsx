// ============================================================================
// SUFFAT-UL HUFFAZ ERP - UNIVERSAL DASHBOARD SCHEMAS
// File: universal-page-schemas.tsx
// Objective: Pre-configured JSON schemas for all major modules to immediately
//            instantiate pages using the UniversalDashboardLayout wrapper.
// ============================================================================

import { 
  DollarSign, Landmark, ShieldCheck, Activity, Truck, AlertTriangle, 
  Calendar, FileCheck, ClipboardList, ShieldAlert, Award, BookOpen, Users
} from "lucide-react";

export const getSidebarLinks = (activeId: string) => [
  { id: "dashboard", label: "Central Dashboard", icon: Activity, isActive: activeId === "dashboard" },
  { id: "finance", label: "Financial Vault", icon: DollarSign, isActive: activeId === "finance" },
  { id: "students", label: "Student Roster", icon: Users, isActive: activeId === "students" },
];

// ============================================================================
// 1. FINANCIAL VAULT DASHBOARD SCHEMA [cite: 123, 223]
// ============================================================================
export const financialsDashboardSchema = {
  tenantName: "CALICUT-HUB",
  pageTitle: "Financial Vault & Ledger Tracker",
  pageSubtitle: "Auditing branch balances, double-entry transactional ledgers, and cash reserves [cite: 123].",
  securityStatus: "RLS Enforcement Layer: ACTIVE [cite: 98]",
  metrics: [
    {
      id: "fin-m1",
      title: "Total Tracked Assets",
      value: "₹6,80,50,000",
      changeLabel: "500+ Items",
      isPositive: true,
      statusText: "Verified",
      statusType: "success" as const,
      icon: DollarSign
    },
    {
      id: "fin-m2",
      title: "Liquid Cash & Reserves",
      value: "₹7,00,50,000",
      changeLabel: "4 SCB Accounts",
      isPositive: true,
      statusText: "Reconciled",
      statusType: "success" as const,
      icon: Landmark
    },
    {
      id: "fin-m3",
      title: "Asset Appraisals (FY26)",
      value: "₹7,52,00,000",
      changeLabel: "+11.4% Appreciation",
      isPositive: true,
      statusText: "Audit Signed",
      statusType: "success" as const,
      icon: ShieldCheck
    }
  ],
  primaryTable: {
    title: "Double-Entry Transaction Ledger [cite: 123]",
    headers: ["Transaction ID", "Description", "Flow Status", "Amount (INR)", "Action"],
    rows: [
      {
        id: "TX-9901",
        columns: [
          { key: "id", value: "TX-9901", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "desc", value: "Dell Core i9 Smart Lab Stations Allocation" },
          { key: "status", value: "RECONCILED", styleClass: "text-emerald-400 text-xs font-bold" },
          { key: "amount", value: "₹12,50,000", styleClass: "font-mono font-semibold" },
          { key: "action", value: "Inspect Trace" }
        ],
        metaData: {
          verifier: "Dr. Faisal K. (SRE Accountant)",
          hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          timestamp: "2026-08-19 04:00:00"
        }
      },
      {
        id: "TX-9902",
        columns: [
          { key: "id", value: "TX-9902", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "desc", value: "Solid Teak Quran Storage Cabinets Purchase" },
          { key: "status", value: "RECONCILED", styleClass: "text-emerald-400 text-xs font-bold" },
          { key: "amount", value: "₹4,50,000", styleClass: "font-mono font-semibold" },
          { key: "action", value: "Inspect Trace" }
        ],
        metaData: {
          verifier: "Er. Faisal K.",
          hash: "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03",
          timestamp: "2026-08-19 04:15:00"
        }
      },
      {
        id: "TX-9903",
        columns: [
          { key: "id", value: "TX-9903", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "desc", value: "Interactive Smart Board Displays 75\"" },
          { key: "status", value: "PENDING_VERIFICATION", styleClass: "text-amber-400 text-xs font-bold animate-pulse" },
          { key: "amount", value: "₹8,50,000", styleClass: "font-mono font-semibold" },
          { key: "action", value: "Inspect Trace" }
        ],
        metaData: {
          verifier: "System Pending",
          hash: "a28cd7e834d943da0c2a29dc286a2ee9228e9d3434ca495111b782c9e83bd092",
          timestamp: "2026-08-19 04:20:00"
        }
      }
    ]
  },
  sidebarWidget: {
    title: "Double-Entry Integrity Audit [cite: 123]",
    type: "FINANCIAL_STATISTICS",
    details: [
      { label: "Active Bank Ledger Pool", value: "SCB, Al Baraka, SBI" },
      { label: "Active Physical Gold Reserve", value: "₹2,28,00,000" },
      { label: "Consolidated Liquidity Pool", value: "₹7,00,50,000" },
      { label: "Audit Block Chain Sync", value: "Locked ✓", isSecure: true }
    ]
  }
};

// ============================================================================
// 2. ACTIVE TRANSPORT FLEET DASHBOARD SCHEMA [cite: 30, 224]
// ============================================================================
export const fleetDashboardSchema = {
  tenantName: "CALICUT-HUB",
  pageTitle: "Active Transport Fleet Inspector",
  pageSubtitle: "Managing logistics, vehicle service ledgers, fuel journals, and regulatory compliance [cite: 30].",
  securityStatus: "RLS Enforcement Layer: ACTIVE [cite: 98]",
  metrics: [
    {
      id: "flt-m1",
      title: "Active Transport Fleet",
      value: "32 Vehicles",
      changeLabel: "In-Service Nodes",
      isPositive: true,
      statusText: "Operational",
      statusType: "success" as const,
      icon: Truck
    },
    {
      id: "flt-m2",
      title: "Pending Maintenance",
      value: "2 Vehicles",
      changeLabel: "Under SRE Check",
      isPositive: false,
      statusText: "Scheduled",
      statusType: "warning" as const,
      icon: AlertTriangle
    },
    {
      id: "flt-m3",
      title: "Upcoming Insurance Expiry",
      value: "5 Days",
      changeLabel: "Policy renewal required",
      isPositive: false,
      statusText: "Critical",
      statusType: "danger" as const,
      icon: ShieldAlert
    }
  ],
  primaryTable: {
    title: "Vehicle Operational Registry [cite: 30]",
    headers: ["Plate Number", "Vehicle Type", "Status", "YTD Maintenance", "Action"],
    rows: [
      {
        id: "KL-01-CB-8801",
        columns: [
          { key: "plate", value: "KL-01-CB-8801", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "type", value: "Tata Winger LMS Van (15-Seater)" },
          { key: "status", value: "OPERATIONAL", styleClass: "text-emerald-400 text-xs font-bold" },
          { key: "maintenance", value: "₹34,200", styleClass: "font-mono" },
          { key: "action", value: "Inspect Logistics" }
        ],
        metaData: {
          insuranceExpiry: "2026-09-12",
          rtoFeesPaid: "Verified ✓",
          driverName: "Yaseen Ahmed"
        }
      },
      {
        id: "UP-16-AT-9022",
        columns: [
          { key: "plate", value: "UP-16-AT-9022", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "type", value: "Force Traveller Medium Bus (20-Seater)" },
          { key: "status", value: "UNDER_MAINTENANCE", styleClass: "text-amber-400 text-xs font-bold" },
          { key: "maintenance", value: "₹89,500", styleClass: "font-mono" },
          { key: "action", value: "Inspect Logistics" }
        ],
        metaData: {
          insuranceExpiry: "2026-08-24 (Critical)",
          rtoFeesPaid: "Processing...",
          driverName: "Sajid Khan"
        }
      }
    ]
  },
  sidebarWidget: {
    title: "Logistics Overview",
    type: "FLEET_LOGISTICS",
    details: [
      { label: "Active Regional Transport Routes", value: "14 Paths Configured" },
      { label: "Daily Logged Kilometers", value: "850 km Consolidated" },
      { label: "Total Fleet Insurance Premium", value: "₹1,85,000 / Yr" },
      { label: "Regulatory Compliance Rate", value: "94.2% Passed", isSecure: true }
    ]
  }
};

// ============================================================================
// 3. AFFILIATION APPROVALS DASHBOARD SCHEMA [cite: 199, 223]
// ============================================================================
export const affiliationDashboardSchema = {
  tenantName: "KERALA-HQ-CENTRAL",
  pageTitle: "Accreditation & Affiliation Approvals",
  pageSubtitle: "Processing structural audits, educational criteria, media proofs, and inspector dispatch [cite: 199].",
  securityStatus: "RLS Enforcement Layer: ACTIVE [cite: 98]",
  metrics: [
    {
      id: "aff-m1",
      title: "Pending Affiliations",
      value: "14 Institutes",
      changeLabel: "In Review Queue",
      isPositive: true,
      statusText: "Active Audits",
      statusType: "warning" as const,
      icon: ClipboardList
    },
    {
      id: "aff-m2",
      title: "Digital Media Verified",
      value: "84 Files Passed",
      changeLabel: "Hostel/Classroom Photos",
      isPositive: true,
      statusText: "Hash Verified",
      statusType: "success" as const,
      icon: FileCheck
    },
    {
      id: "aff-m3",
      title: "On-Site Inspections Scheduled",
      value: "6 Dispatches",
      changeLabel: "Regional Boards Active",
      isPositive: true,
      statusText: "SRE Scheduled",
      statusType: "success" as const,
      icon: Calendar
    }
  ],
  primaryTable: {
    title: "Regional Accreditation Applications [cite: 199]",
    headers: ["Application ID", "Institute Name", "Workflow Stage", "HQ Compliance", "Action"],
    rows: [
      {
        id: "AFF-2026-001",
        columns: [
          { key: "id", value: "AFF-2026-001", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "name", value: "Darul Uloom Integrated Hub (Calicut)" },
          { key: "stage", value: "PHYSICAL_INSPECTION_PENDING", styleClass: "text-amber-400 text-xs font-bold" },
          { key: "compliance", value: "98% (Passed Checklist)", styleClass: "text-emerald-400 font-semibold" },
          { key: "action", value: "Launch Audit Portal" }
        ],
        metaData: {
          trustCertificate: "GCP Registry Verified ✓",
          classroomVideoHash: "sha256-df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e8",
          assignedInspector: "Dr. Abdul Rahman K."
        }
      },
      {
        id: "AFF-2026-002",
        columns: [
          { key: "id", value: "AFF-2026-002", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "name", value: "Al-Ansar Educational Academy (Wayanad)" },
          { key: "stage", value: "DOCUMENTS_VERIFICATION", styleClass: "text-blue-400 text-xs font-bold animate-pulse" },
          { key: "compliance", value: "Waiting For Fire & Safety upload", styleClass: "text-amber-400 font-medium" },
          { key: "action", value: "Launch Audit Portal" }
        ],
        metaData: {
          trustCertificate: "Pending Upload",
          classroomVideoHash: "File Not Uploaded",
          assignedInspector: "Qari Abdullah Al-Hafiz"
        }
      }
    ]
  },
  sidebarWidget: {
    title: "Accreditation Thresholds [cite: 175]",
    type: "AFFILIATION_REQUIREMENTS",
    details: [
      { label: "Syllabus Compliance Policy", value: "Board Approved [cite: 175]" },
      { label: "Ustadh Tajweed Sanad Credentials", value: "Verified by Board [cite: 175]" },
      { label: "Local Safety Clearances", value: "Civil Defense Cert" },
      { label: "LMS Cache Server Support", value: "Approved [cite: 175]" }
    ]
  }
};

// ============================================================================
// 4. ACADEMICS & CURRICULUM BLUEPRINT SCHEMA [cite: 175, 221]
// ============================================================================
export const academicsDashboardSchema = {
  tenantName: "CALICUT-HUB",
  pageTitle: "Academic Hierarchy & Roster Engine",
  pageSubtitle: "Structuring course levels, teacher assignments, student rosters, and Sanad pathways [cite: 175].",
  securityStatus: "RLS Enforcement Layer: ACTIVE [cite: 98]",
  metrics: [
    {
      id: "acd-m1",
      title: "Total Enrolled Huffaz",
      value: "412 Students",
      changeLabel: "98% Attendance Rate",
      isPositive: true,
      statusText: "Synced",
      statusType: "success" as const,
      icon: Users
    },
    {
      id: "acd-m2",
      title: "Active Hifz Courses",
      value: "18 Programs",
      changeLabel: "Syllabus Managed",
      isPositive: true,
      statusText: "Compliant [cite: 175]",
      statusType: "success" as const,
      icon: BookOpen
    },
    {
      id: "acd-m3",
      title: "Sanad Certifications (YTD)",
      value: "24 Graduations",
      changeLabel: "+5 Pending Exams",
      isPositive: true,
      statusText: "Secure Chain",
      statusType: "success" as const,
      icon: Award
    }
  ],
  primaryTable: {
    title: "Academic Student Roster & Tracking",
    headers: ["Student ID", "Name", "Assigned Ustadh", "Current Sabaq Juz", "Action"],
    rows: [
      {
        id: "STU-501",
        columns: [
          { key: "id", value: "STU-501", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "name", value: "Abdullah Siddiqui" },
          { key: "teacher", value: "Moulana Sajid Rahman (Sanad Holder)" },
          { key: "juz", value: "Juz 24 (Sabaq-Para Syncing)", styleClass: "text-emerald-400 font-medium" },
          { key: "action", value: "Open Progress Log" }
        ],
        metaData: {
          attendancePct: "99.4%",
          nextExamDate: "2026-08-25",
          academicLevel: "Advanced Memorization (Hifz)"
        }
      },
      {
        id: "STU-502",
        columns: [
          { key: "id", value: "STU-502", styleClass: "font-mono text-blue-400 font-bold" },
          { key: "name", value: "Fatima Zahra" },
          { key: "teacher", value: "Al-Hafiza Maryam Bibi" },
          { key: "juz", value: "Juz 18", styleClass: "text-emerald-400 font-medium" },
          { key: "action", value: "Open Progress Log" }
        ],
        metaData: {
          attendancePct: "97.8%",
          nextExamDate: "2026-08-24",
          academicLevel: "Intermediate Progress (Hifz)"
        }
      }
    ]
  },
  sidebarWidget: {
    title: "Curriculum Standards",
    type: "ACADEMIC_SYLLABUS",
    details: [
      { label: "Sabaq (Daily Memorization)", value: "Mandatory Daily Audits" },
      { label: "Sabqi (Previous Review)", value: "7-Day Sliding Window" },
      { label: "Manzil (Consolidated Review)", value: "1 Juz Minimum Daily" },
      { label: "Sanad Certificate Authority", value: "Linked to National Board [cite: 175]" }
    ]
  }
};

