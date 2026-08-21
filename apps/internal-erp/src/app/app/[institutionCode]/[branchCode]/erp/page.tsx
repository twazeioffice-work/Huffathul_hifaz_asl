import React from "react";
import { Card, CardBody, CardHeader, Button, Progress } from "@heroui/react";
import { TopNavigationBar } from "@/components/navigation/TopNavigationBar";

export default async function InstitutionDashboard({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = await params;

  const tenantName = `${institutionCode.toUpperCase()} — ${branchCode.toUpperCase()}`;
  const mockUser = {
    name: "Br. Tariq Mehmood",
    email: "tariq@huffaz.org",
    role: "NAZIM" as const,
  };

  const statCards = [
    { title: "Total Student Enrollment", value: "312", change: "+12% this month", progress: 85 },
    { title: "Overall Attendance Rate", value: "96.4%", change: "Within target (95%)", progress: 96 },
    { title: "Sadaqah Ledger Balance", value: "₹45,230.00", change: "+₹14,500 today", progress: 72 },
    { title: "Active Halqa Classes", value: "14", change: "2 newly established", progress: 100 },
  ];

  const recentTransactions = [
    { id: "TXN-001", account: "General Tuition Credit", amount: "+₹1,200.00", date: "Today, 10:22 AM", status: "COMPLETED" },
    { id: "TXN-002", account: "Sadaqah Donation Credit", amount: "+₹5,000.00", date: "Today, 09:15 AM", status: "COMPLETED" },
    { id: "TXN-003", account: "Ustad Payroll Outflow", amount: "-₹22,000.00", date: "Yesterday, 04:30 PM", status: "COMPLETED" },
    { id: "TXN-004", account: "Kitchen Supplies Expense", amount: "-₹4,500.00", date: "Yesterday, 11:00 AM", status: "COMPLETED" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Global Navigation */}
      <TopNavigationBar
        institutionCode={institutionCode}
        branchCode={branchCode}
        currentTenantName={tenantName}
        userRole={mockUser.role}
        userName={mockUser.name}
        userEmail={mockUser.email}
      />

      {/* 2. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Dynamic Gradient Title Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold font-mono text-primary tracking-wider uppercase">
              System Operations Active
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            Welcome back, {mockUser.name}
          </h1>
          <p className="text-muted-foreground text-sm tracking-tight max-w-xl">
            Administrative insights, financial metrics, and academic records for your assigned boundary.
          </p>
        </div>

        {/* High-End Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <Card
              key={i}
              shadow="none"
              className="apple-glass-panel hover:border-primary/30 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="flex flex-col items-start gap-1 pb-2">
                <span className="text-xs font-bold text-muted-foreground tracking-tight">{card.title}</span>
                <span className="text-3xl font-extrabold tracking-tighter text-white">{card.value}</span>
              </CardHeader>
              <CardBody className="pt-0 flex flex-col gap-3">
                <Progress size="sm" value={card.progress} color="primary" className="max-w-md" />
                <span className="text-xs font-semibold text-primary font-mono tracking-tight flex items-center gap-1">
                  {card.change}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Bottom Dual-Section Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Double-Entry Ledger */}
          <Card shadow="none" className="apple-glass-panel lg:col-span-2">
            <CardHeader className="flex flex-col items-start gap-1 border-b border-white/5 pb-4">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">Financial Activity Ledger</span>
              <span className="text-xl font-bold text-white tracking-tight">Recent Ledger Postings</span>
            </CardHeader>
            <CardBody className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-muted-foreground font-mono text-xs">
                    <th className="px-6 py-4 font-semibold">Voucher ID</th>
                    <th className="px-6 py-4 font-semibold">Account Category</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors duration-150">
                      <td className="px-6 py-4 font-mono text-sm text-white font-medium">{tx.id}</td>
                      <td className="px-6 py-4 flex flex-col">
                        <span className="text-sm font-semibold text-white">{tx.account}</span>
                        <span className="text-xs text-muted-foreground">{tx.date}</span>
                      </td>
                      <td className={`px-6 py-4 font-mono text-sm font-bold ${
                        tx.amount.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

          {/* SLA Alerts & Escalation Queue */}
          <Card shadow="none" className="apple-glass-panel">
            <CardHeader className="flex flex-col items-start gap-1 border-b border-white/5 pb-4">
              <span className="text-xs font-bold text-red-400 tracking-widest uppercase">Branch SLA Escapes</span>
              <span className="text-xl font-bold text-white tracking-tight">Active Escalation Queue</span>
            </CardHeader>
            <CardBody className="flex flex-col gap-4 py-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-red-400 font-mono">SEVERE COMPLAINT (SLA GONE)</span>
                  <span className="text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">48h Passed</span>
                </div>
                <p className="text-sm font-semibold text-white">Financial auditing delay reported</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-500/10">
                  <span className="text-xs text-muted-foreground">Against: Admin Desk</span>
                  <Button size="sm" variant="shadow" color="danger" className="font-bold">Escalate</Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-yellow-500 font-mono">Open Task</span>
                  <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-300 px-2 py-0.5 rounded-full">New</span>
                </div>
                <p className="text-sm font-semibold text-white">Daily Hifz Sync backlog (3 students pending)</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-yellow-500/10">
                  <span className="text-xs text-muted-foreground">Ustad: Br. Salim Khan</span>
                  <Button size="sm" variant="flat" color="warning" className="font-bold">Sync Ledger</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
