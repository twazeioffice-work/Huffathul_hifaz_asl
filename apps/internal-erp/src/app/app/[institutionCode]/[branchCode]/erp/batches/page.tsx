"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { getSidebarLinks } from "@/components/dashboard/universal-page-schemas";
import { Layers, Users, BookOpen, Clock } from "lucide-react";

export default function BatchesList() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const tenant = `${institutionCode}-${branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    tenantName: tenant.toUpperCase(),
    pageTitle: "Center Batches & Classes",
    pageSubtitle: "Overview of all active batches, assigned Ustads, and student capacities.",
    metrics: [
      {
        id: "batch-m1",
        title: "Total Batches",
        value: "42",
        changeLabel: "All active",
        isPositive: true,
        statusText: "Operational",
        statusType: "success" as const,
        icon: Layers
      },
      {
        id: "batch-m2",
        title: "Total Students",
        value: "312",
        icon: Users
      },
      {
        id: "batch-m3",
        title: "Total Ustads",
        value: "14",
        icon: BookOpen
      }
    ],
    primaryTable: {
      title: "Active Batches Directory",
      subtitle: "List of all batches with headcounts and assigned personnel",
      headers: ["Batch Code", "Batch Name", "Assigned Ustad", "Students", "Action"],
      rows: [
        { id: "BCH-2026-A", code: "BCH-2026-A", name: "Hifz Senior A", ustad: "Ustad Bilal", students: 24 },
        { id: "BCH-2026-B", code: "BCH-2026-B", name: "Hifz Senior B", ustad: "Ustad Khalid", students: 22 },
        { id: "BCH-2026-C", code: "BCH-2026-C", name: "Hifz Junior A", ustad: "Ustad Tariq", students: 28 },
        { id: "BCH-2026-D", code: "BCH-2026-D", name: "Hifz Junior B", ustad: "Ustad Yusuf", students: 30 },
        { id: "BCH-2026-E", code: "BCH-2026-E", name: "Foundation", ustad: "Ustad Imran", students: 45 },
      ].map(b => ({
        id: b.id,
        columns: [
          { key: "code", value: b.code, styleClass: "font-mono text-blue-600 font-bold" },
          { key: "name", value: b.name, styleClass: "font-semibold" },
          { key: "ustad", value: b.ustad, styleClass: "text-slate-600" },
          { key: "students", value: `${b.students} Enrolled`, styleClass: "text-emerald-600 font-medium" },
          { key: "action", value: "View Students", styleClass: "text-blue-500 hover:underline" }
        ]
      }))
    }
  };

  const sidebarLinks = getSidebarLinks("academics"); // Just using a default sidebar

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      sidebarLinks={sidebarLinks}
      onSidebarClick={(id) => {
        if (id === 'dashboard') window.location.href = `/app/${institutionCode}/${branchCode}/erp`;
      }}
      onRowActionClick={(rowId) => {
        window.location.href = `/app/${institutionCode}/${branchCode}/erp/batches/${rowId}`;
      }}
    />
  );
}
