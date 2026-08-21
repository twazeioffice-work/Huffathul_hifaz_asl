"use client";

import React, { use } from "react";
import { notFound, useParams } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { academicsDashboardSchema, getSidebarLinks } from "@/components/dashboard/universal-page-schemas";

export default function AcademicsPage() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const tenant = `${institutionCode}-${branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    ...academicsDashboardSchema,
    tenantName: tenant.toUpperCase(),
  };

  const sidebarLinks = getSidebarLinks("academics");

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
        console.log(`[ACADEMIC RECORD TRACE] Tenant ${tenant} querying student/course: ${rowId}`, metaData);
      }}
    />
  );
}
