"use client";

import React from "react";
import { notFound } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { fleetDashboardSchema } from "@/components/dashboard/universal-page-schemas";

interface PageProps {
  params: {
    institutionCode: string;
    branchCode: string;
  };
}

export default function FleetPage({ params }: PageProps) {
  const tenant = `${params.institutionCode}-${params.branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  const pageSchema = {
    ...fleetDashboardSchema,
    tenantName: tenant.toUpperCase(),
  };

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      onRowActionClick={(rowId, metaData) => {
        console.log(`[FLEET RECOVERY DISPATCH] Tenant ${tenant} tracking asset: ${rowId}`, metaData);
      }}
    />
  );
}
