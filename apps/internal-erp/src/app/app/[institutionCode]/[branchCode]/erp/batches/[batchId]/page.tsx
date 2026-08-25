"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { getSidebarLinks } from "@/components/dashboard/universal-page-schemas";
import { Users, GraduationCap, CheckCircle } from "lucide-react";

export default function BatchDetails() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;
  const batchId = params.batchId as string;

  const tenant = `${institutionCode}-${branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  // Generate some mock students based on batchId
  const students = Array.from({ length: 24 }).map((_, i) => ({
    id: `STU-${batchId}-${1000 + i}`,
    admissionNo: `ADM-${202600 + i}`,
    name: `Student Name ${i + 1}`,
    status: "ACTIVE"
  }));

  const pageSchema = {
    tenantName: tenant.toUpperCase(),
    pageTitle: `Batch Details: ${batchId}`,
    pageSubtitle: `Student roster and performance metrics for batch ${batchId}.`,
    metrics: [
      {
        id: "b-m1",
        title: "Enrolled Students",
        value: students.length.toString(),
        isPositive: true,
        statusText: "Full Capacity",
        statusType: "success" as const,
        icon: Users
      },
      {
        id: "b-m2",
        title: "Assigned Ustad",
        value: "Ustad Bilal",
        icon: GraduationCap
      },
      {
        id: "b-m3",
        title: "Average Attendance",
        value: "96.5%",
        isPositive: true,
        statusText: "Excellent",
        statusType: "success" as const,
        icon: CheckCircle
      }
    ],
    primaryTable: {
      title: "Student Roster",
      subtitle: `All students currently enrolled in ${batchId}`,
      headers: ["Admission #", "Name", "Status", "Action"],
      rows: students.map(s => ({
        id: s.id,
        columns: [
          { key: "adm", value: s.admissionNo, styleClass: "font-mono text-blue-600 font-bold" },
          { key: "name", value: s.name, styleClass: "font-semibold" },
          { key: "status", value: s.status, styleClass: "text-emerald-600 font-medium" },
          { key: "action", value: "View Profile", styleClass: "text-blue-500 hover:underline cursor-pointer" }
        ]
      }))
    }
  };

  const sidebarLinks = getSidebarLinks("academics");

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      sidebarLinks={sidebarLinks}
      onSidebarClick={(id) => {
        if (id === 'dashboard') window.location.href = `/app/${institutionCode}/${branchCode}/erp`;
      }}
      onRowActionClick={(rowId) => {
        window.location.href = `/app/${institutionCode}/${branchCode}/erp/students/${rowId}`;
      }}
    />
  );
}
