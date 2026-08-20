"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { affiliationDashboardSchema } from "@/components/dashboard/universal-page-schemas";

interface PageProps {
  params: Promise<{
    institutionCode: string;
    branchCode: string;
  }>;
}

export default function AffiliationsPage(props: PageProps) {
  const params = use(props.params);
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
