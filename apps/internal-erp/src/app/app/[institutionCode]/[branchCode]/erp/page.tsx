"use client";

import React, { use } from "react";
import { notFound, useParams } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { getSidebarLinks } from "@/components/dashboard/universal-page-schemas";
import { Activity, Users, DollarSign, BookOpen } from "lucide-react";

export default function InstitutionDashboard() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const tenant = `${institutionCode}-${branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    tenantName: tenant.toUpperCase(),
    pageTitle: "Central Operations Dashboard",
    pageSubtitle: "Administrative insights, financial metrics, and academic records for your assigned boundary.",
    securityStatus: "RLS Enforcement Layer: ACTIVE",
    metrics: [
      {
        id: "main-m1",
        title: "Total Student Enrollment",
        value: "312",
        changeLabel: "+12% this month",
        isPositive: true,
        statusText: "Synced",
        statusType: "success" as const,
        icon: Users
      },
      {
        id: "main-m2",
        title: "Overall Attendance Rate",
        value: "96.4%",
        changeLabel: "Within target (95%)",
        isPositive: true,
        statusText: "Verified",
        statusType: "success" as const,
        icon: Activity
      },
      {
        id: "main-m3",
        title: "Sadaqah Ledger Balance",
        value: "₹45,230.00",
        changeLabel: "+₹14,500 today",
        isPositive: true,
        statusText: "Reconciled",
        statusType: "success" as const,
        icon: DollarSign
      },
      {
        id: "main-m4",
        title: "Active Halqa Classes",
        value: "14",
        changeLabel: "2 newly established",
        isPositive: true,
        statusText: "Operational",
        statusType: "success" as const,
        icon: BookOpen
      }
    ],
    primaryTable: {
      title: "Recent Ledger Postings",
      subtitle: "Financial Activity Ledger",
      headers: ["Voucher ID", "Account Category", "Status", "Amount", "Action"],
      rows: [
        {
          id: "TXN-001",
          columns: [
            { key: "id", value: "TXN-001", styleClass: "font-mono text-blue-400 font-bold" },
            { key: "account", value: "General Tuition Credit" },
            { key: "status", value: "COMPLETED", styleClass: "text-emerald-400 text-xs font-bold" },
            { key: "amount", value: "+₹1,200.00", styleClass: "font-mono font-semibold text-emerald-400" },
            { key: "action", value: "Inspect Trace" }
          ],
          metaData: { timestamp: "Today, 10:22 AM" }
        },
        {
          id: "TXN-002",
          columns: [
            { key: "id", value: "TXN-002", styleClass: "font-mono text-blue-400 font-bold" },
            { key: "account", value: "Sadaqah Donation Credit" },
            { key: "status", value: "COMPLETED", styleClass: "text-emerald-400 text-xs font-bold" },
            { key: "amount", value: "+₹5,000.00", styleClass: "font-mono font-semibold text-emerald-400" },
            { key: "action", value: "Inspect Trace" }
          ],
          metaData: { timestamp: "Today, 09:15 AM" }
        },
        {
          id: "TXN-003",
          columns: [
            { key: "id", value: "TXN-003", styleClass: "font-mono text-blue-400 font-bold" },
            { key: "account", value: "Ustad Payroll Outflow" },
            { key: "status", value: "COMPLETED", styleClass: "text-emerald-400 text-xs font-bold" },
            { key: "amount", value: "-₹22,000.00", styleClass: "font-mono font-semibold text-rose-400" },
            { key: "action", value: "Inspect Trace" }
          ],
          metaData: { timestamp: "Yesterday, 04:30 PM" }
        }
      ]
    },
    sidebarWidget: {
      title: "Active Escalation Queue",
      type: "SLA_ALERTS",
      details: [
        { label: "Financial auditing delay", value: "SEVERE (48h Passed)" },
        { label: "Daily Hifz Sync backlog", value: "WARNING (3 pending)" }
      ]
    }
  };

  const sidebarLinks = getSidebarLinks("dashboard");

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      sidebarLinks={sidebarLinks}
      onSidebarClick={(id) => {
        if (id === 'dashboard') window.location.href = `/app/${institutionCode}/${branchCode}/erp`;
        if (id === 'academics') window.location.href = `/app/${institutionCode}/${branchCode}/erp/academics`;
        if (id === 'finance') window.location.href = `/app/${institutionCode}/${branchCode}/erp/finance`;
        if (id === 'students') window.location.href = `/app/${institutionCode}/${branchCode}/erp/students`;
      }}
      onRowActionClick={(rowId, metaData) => {
        console.log(`Row clicked: ${rowId}`, metaData);
      }}
    />
  );
}
