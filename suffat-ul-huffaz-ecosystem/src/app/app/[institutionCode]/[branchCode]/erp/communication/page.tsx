"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { WhatsAppTimelineDashboard } from "@/components/dashboard/WhatsAppTimelineDashboard";

interface PageProps {
  params: Promise<{
    institutionCode: string;
    branchCode: string;
  }>;
}

export default function CommunicationGatewayPage(props: PageProps) {
  const params = use(props.params);
  const tenant = `${params.institutionCode}-${params.branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  // The WhatsAppTimelineDashboard acts as a full-page Apple-spec layout
  return <WhatsAppTimelineDashboard tenantId={tenant.toUpperCase()} />;
}
