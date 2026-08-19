"use client";

import React from "react";
import { notFound } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { affiliationDashboardSchema } from "@/components/dashboard/universal-page-schemas";

interface PageProps {
  params: {
    institutionCode: string;
    branchCode: string;
  };
}

export default function AffiliationsPage({ params }: PageProps) {
  const tenant = `${params.institutionCode}-${params.branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    ...affiliationDashboardSchema,
    tenantName: tenant.toUpperCase(),
  };

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      onRowActionClick={(rowId, metaData) => {
        console.log(`[ACCREDITATION AUDIT INITIATED] Tenant ${tenant} evaluating: ${rowId}`, metaData);
      }}
    />
  );
}
