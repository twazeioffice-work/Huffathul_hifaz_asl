"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { getSidebarLinks } from "@/components/dashboard/universal-page-schemas";
import { Users, GraduationCap, CheckCircle, Clock } from "lucide-react";
import { getStudentMetrics } from "../actions";

export default function StudentRoster() {
  const params = useParams();
  const router = useRouter();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (institutionCode && branchCode) {
      getStudentMetrics(institutionCode, branchCode).then(data => setMetrics(data));
    }
  }, [institutionCode, branchCode]);

  const tenant = ${institutionCode}-;

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
        value: metrics ? metrics.totalStudents.toLocaleString() : "...",
        changeLabel: "+5% YTD",
        isPositive: true,
        statusText: "Enrolled",
        statusType: "success" as const,
        icon: Users
      },
      {
        id: "stu-m2",
        title: "Active Batches",
        value: metrics ? metrics.activeBatches.toString() : "...",
        changeLabel: "All divisions",
        isPositive: true,
        statusText: "Operational",
        statusType: "success" as const,
        icon: GraduationCap
      },
      {
        id: "stu-m3",
        title: "Average Attendance",
        value: metrics ? metrics.averageAttendance : "...",
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
      rows: metrics ? metrics.studentsList.map((student: any) => ({
        id: student.id,
        columns: [
          { key: "id", value: student.id.slice(0, 8).toUpperCase(), styleClass: "font-mono text-blue-400 font-bold" },
          { key: "name", value: student.name },
          { key: "batch", value: "Batch 2026", styleClass: "text-muted-foreground" },
          { key: "status", value: "ACTIVE", styleClass: "text-emerald-400 text-xs font-bold" },
          { key: "action", value: "View Record" }
        ],
        metaData: { admissionDate: student.admissionDate || "2026-01-15" }
      })) : []
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

  const sidebarLinks = getSidebarLinks("students").filter(l => l.id !== 'academics'); // Ensure academics is removed here too

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      sidebarLinks={sidebarLinks}
      onSidebarClick={(id) => {
        if (id === 'dashboard') router.push(/app/ + institutionCode + / + branchCode + /erp);
        if (id === 'finance') router.push(/app/ + institutionCode + / + branchCode + /erp/finance);
        if (id === 'students') router.push(/app/ + institutionCode + / + branchCode + /erp/students);
      }}
      onRowActionClick={(rowId, metaData) => {
        router.push(/app/ + institutionCode + / + branchCode + /erp/students/ + rowId);
      }}
    />
  );
}
