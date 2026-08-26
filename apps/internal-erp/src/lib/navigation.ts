export type Role =
  | "SUPER_ADMIN"
  | "GLOBAL_JUNCTION"
  | "CENTER_ADMIN"
  | "NAZIM"
  | "USTAD"
  | "STUDENT"
  | "PARENT";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const SUPER_ADMIN_NAV: NavItem[] = [
  { label: "Command Center", href: "/app/suffat-hq/main/erp" },
  { label: "Students (Global)", href: "/app/suffat-hq/main/erp/students" },
  { label: "Staff & Payroll", href: "/app/suffat-hq/main/erp/staff-payroll" },
  { label: "Billing", href: "/app/suffat-hq/main/erp/billing" },
  { label: "Master Ledger", href: "/app/suffat-hq/main/erp/master-ledger" },
  { label: "Assets & Fleet", href: "/app/suffat-hq/main/erp/assets-fleet" },
  { label: "Communication", href: "/app/suffat-hq/main/erp/communication" },
  { label: "Complaints Inbox", href: "/app/suffat-hq/main/erp/complaints" },
  { label: "Global Reports", href: "/app/suffat-hq/main/erp/reports" }
];

export const CENTER_ADMIN_NAV: NavItem[] = [
  { label: "Center Overview", href: "/erp" },
  { label: "Manage Local Ustads", href: "/erp/ustads" },
  { label: "Manage Local Students", href: "/erp/students" },
  { label: "Branch Ledger & Finance", href: "/erp/finance" },
  { label: "Local WhatsApp Triaging", href: "/erp/whatsapp" },
  { label: "Complaints Inbox", href: "/erp/complaints" },
  { label: "Kitchen & Headcounts", href: "/erp/kitchen" }
];

export const NAZIM_NAV: NavItem[] = [
  { label: "Manage Ustads", href: "/erp/ustads" },
  { label: "Local WhatsApp Triaging", href: "/erp/whatsapp" },
  { label: "Kitchen & Headcount", href: "/erp/kitchen" }
];

export const USTAD_COMMAND_STRIP: NavItem[] = [
  { label: 'Dashboard', href: '/erp/academics' },
  { label: "Attendance & Prayers", href: "/erp/academics?tab=ATTENDANCE" },
  { label: "Hifz Sabaq", href: "/erp/academics?tab=SABAQ" },
  { label: "Sabqi", href: "/erp/academics?tab=SABQI" },
  { label: "Manzil", href: "/erp/academics?tab=MANZIL" },
  { label: "Adab & Behavior", href: "/erp/academics?tab=ADAB" }
];

export const PORTAL_NAV: NavItem[] = [
  { label: "My Progress", href: "/progress" },
  { label: "Secure Grievance Registry", href: "/grievance" },
  { label: "Campus Notice Board", href: "/notices" }
];


