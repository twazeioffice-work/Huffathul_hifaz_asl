"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function StaffSlipPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.staffId as string;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Salary Slip: {staffId}</h1>
          <p className="text-sm text-slate-700">Detailed breakdown of monthly payroll.</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>Back to Roster</Button>
      </div>
      <GlassCard className="p-8 text-center text-slate-500">
        Payroll details for {staffId} will be generated here.
      </GlassCard>
    </div>
  );
}
