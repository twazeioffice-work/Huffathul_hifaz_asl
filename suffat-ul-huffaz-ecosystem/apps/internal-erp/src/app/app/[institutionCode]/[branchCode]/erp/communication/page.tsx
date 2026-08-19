"use client";

import React from "react";
import { notFound } from "next/navigation";
import { WhatsAppTimelineDashboard } from "@/components/dashboard/WhatsAppTimelineDashboard";

interface PageProps {
  params: {
    institutionCode: string;
    branchCode: string;
  };
}

export default function CommunicationGatewayPage({ params }: PageProps) {
  const tenant = `${params.institutionCode}-${params.branchCode}`;

  if (!tenant || tenant.trim() === "-") {
    return notFound();
  }

  // The WhatsAppTimelineDashboard acts as a full-page Apple-spec layout
  return <WhatsAppTimelineDashboard tenantId={tenant.toUpperCase()} />;
}
