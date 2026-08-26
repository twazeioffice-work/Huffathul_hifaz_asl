"use client";

import React from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Users, BookOpen, Activity, AlertCircle, DollarSign, Utensils, MessageSquare } from "lucide-react";

export default function CenterAdminDashboard({ institutionCode, branchCode, metrics }: { institutionCode: string; branchCode: string; metrics: any }) {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black font-semibold">{branchCode.toUpperCase()} Center Operations Dashboard</h1>
          <p className="text-sm text-slate-700 font-medium">Administrative insights, financial metrics, and academic records for your assigned boundary.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Send Announcement</Button>
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Students"
          value={metrics.totalStudents.toString()}
          trend="+12 this month"
          icon={<Users size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/batches`}
        />
        <KpiCard
          title="Active Ustads"
          value={metrics.activeUstads.toString()}
          icon={<BookOpen size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/ustads`}
        />
        <KpiCard
          title="Attendance Today"
          value={metrics.todayAttendance}
          trend="Target: 95%"
          icon={<Activity size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/students?tab=attendance`}
        />
        <KpiCard
          title="Pending Welfare Cases"
          value={metrics.activeCases.toString()}
          trend="1 SLA breach"
          icon={<AlertCircle size={20} className="text-amber-400" />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/complaints`}
        />
        <KpiCard
          title="Monthly Revenue"
          value="₹45,230"
          icon={<DollarSign size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/finance`}
        />
        <KpiCard
          title="Monthly Expenses"
          value="₹22,000"
          icon={<DollarSign size={20} className="text-red-400" />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/finance`}
        />
        <KpiCard
          title="Kitchen Headcount"
          value={metrics.kitchenHeadcount.toString()}
          trend="Today"
          icon={<Utensils size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/kitchen`}
        />
        <KpiCard
          title="WhatsApp Unread"
          value={metrics.whatsappUnread.toString()}
          icon={<MessageSquare size={20} />}
          onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/whatsapp`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-1 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 font-medium mb-4">Quick Actions</h2>
          <div className="flex gap-4">
             <Button variant="secondary">Create Voucher</Button>
             <Button variant="secondary" onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/staff/register`}>Add Ustad</Button>
          </div>
        </GlassCard>
        
        <GlassCard className="col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 font-medium mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <h4 className="text-sm font-semibold text-amber-400">Financial auditing delay</h4>
              <p className="text-xs text-amber-500/80 mt-1">SEVERE (48h Passed)</p>
            </div>
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
              <h4 className="text-sm font-semibold text-red-400">Daily Hifz Sync backlog</h4>
              <p className="text-xs text-red-500/80 mt-1">3 pending</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

