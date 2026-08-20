"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { academicsDashboardSchema } from "@/components/dashboard/universal-page-schemas";

interface PageProps {
  params: Promise<{
    institutionCode: string;
    branchCode: string;
  }>;
}

export default function AcademicsPage(props: PageProps) {
  const params = use(props.params);
  const tenant = `${params.institutionCode}-${params.branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    ...academicsDashboardSchema,
    tenantName: tenant.toUpperCase(),
  };

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      onRowActionClick={(rowId, metaData) => {
        console.log(`[ACADEMIC RECORD TRACE] Tenant ${tenant} querying student/course: ${rowId}`, metaData);
      }}
    />
  );
}
