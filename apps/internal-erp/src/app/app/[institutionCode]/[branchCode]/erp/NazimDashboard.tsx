"use client";

import React from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { BookOpen, Users, MessageSquare, Utensils } from "lucide-react";

export default function NazimDashboard({ institutionCode, branchCode, metrics }: { institutionCode: string; branchCode: string; metrics: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black font-semibold">{branchCode.toUpperCase()} Nazim Operations</h1>
          <p className="text-sm text-slate-700 font-medium">Academic supervision, Ustad management, and triaging.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Ustads"
          value={metrics.activeUstads.toString()}
          icon={<BookOpen size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/ustads`}
        />
        <KpiCard
          title="Academics & Sync"
          value="98%"
          trend="Synced Today"
          icon={<Users size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/academics`}
        />
        <KpiCard
          title="WhatsApp Unread"
          value="12"
          icon={<MessageSquare size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/whatsapp`}
        />
        <KpiCard
          title="Kitchen Headcount"
          value={metrics.kitchenHeadcount.toString()}
          trend="Today"
          icon={<Utensils size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/kitchen`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 font-medium mb-4">Pending Supervisor Actions</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <h4 className="text-sm font-semibold text-amber-600">Pending Leave Approvals</h4>
              <p className="text-xs text-amber-600/80 mt-1">2 Ustads requesting leave</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

