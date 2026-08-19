"use client";

import React from "react";
import { notFound } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { financialsDashboardSchema } from "@/components/dashboard/universal-page-schemas";

interface PageProps {
  params: {
    institutionCode: string;
    branchCode: string;
  };
}

export default function FinancePage({ params }: PageProps) {
  const tenant = `${params.institutionCode}-${params.branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    ...financialsDashboardSchema,
    tenantName: tenant.toUpperCase(),
  };

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      onRowActionClick={(rowId, metaData) => {
        console.log(`[FINANCE AUDIT RUN] Initiated by tenant ${tenant} for row: ${rowId}`, metaData);
      }}
    />
  );
}
