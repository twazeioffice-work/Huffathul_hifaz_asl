"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { getSidebarLinks } from "@/components/dashboard/universal-page-schemas";
import { Users, GraduationCap, CheckCircle, Clock } from "lucide-react";

export default function StudentRoster() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const tenant = `${institutionCode}-${branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    tenantName: tenant.toUpperCase(),
    pageTitle: "Student Roster",
    pageSubtitle: "Manage student records, batch assignments, and admissions.",
    securityStatus: "RLS Enforcement Layer: ACTIVE",
    metrics: [
      {
        id: "stu-m1",
        title: "Total Students",
        value: "1,245",
        changeLabel: "+5% YTD",
        isPositive: true,
        statusText: "Enrolled",
        statusType: "success" as const,
        icon: Users
      },
      {
        id: "stu-m2",
        title: "Active Batches",
        value: "42",
        changeLabel: "All divisions",
        isPositive: true,
        statusText: "Operational",
        statusType: "success" as const,
        icon: GraduationCap
      },
      {
        id: "stu-m3",
        title: "Average Attendance",
        value: "94.2%",
        changeLabel: "Target: 95%",
        isPositive: false,
        statusText: "Warning",
        statusType: "warning" as const,
        icon: Clock
      }
    ],
    primaryTable: {
      title: "Active Enrollment Directory",
      subtitle: "Current students across all active batches",
      headers: ["Admission #", "Name", "Batch", "Status", "Action"],
      rows: [1, 2, 3, 4, 5].map(i => ({
        id: `STU-100${i}`,
        columns: [
          { key: "id", value: `ADM-100${i}`, styleClass: "font-mono text-blue-400 font-bold" },
          { key: "name", value: `Student Name ${i}` },
          { key: "batch", value: "Batch 2026", styleClass: "text-muted-foreground" },
          { key: "status", value: "ACTIVE", styleClass: "text-emerald-400 text-xs font-bold" },
          { key: "action", value: "View Record" }
        ],
        metaData: { admissionDate: "2026-01-15" }
      }))
    },
    sidebarWidget: {
      title: "Admissions Pipeline",
      type: "ADMISSION_STATS",
      details: [
        { label: "Pending Applications", value: "14 Under Review" },
        { label: "Interviews Scheduled", value: "8 This Week" },
        { label: "Recent Enrollments", value: "24 This Month" }
      ]
    }
  };

  const sidebarLinks = getSidebarLinks("students");

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
        console.log(`[STUDENT RECORD] Tenant ${tenant} querying student: ${rowId}`, metaData);
        window.location.href = `/app/${institutionCode}/${branchCode}/erp/students/${rowId}`;
      }}
    />
  );
}
