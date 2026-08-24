"use client";
import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, DollarSign, Users, CheckCircle, AlertCircle } from "lucide-react";




import { useEffect } from 'react';

export default function StaffPayrollPage() {
  const [search, setSearch] = useState("");
  const [staffList, setStaffList] = useState<any[]>([]);
  useEffect(() => { fetch("/api/v1/erp/payroll").then(res => res.json()).then(data => setStaffList(data.length ? data : [{id:"EMP-001", name:"Ahmed Abdullah", role:"Ustad", salary:45000, status:"paid"}])) }, []);
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Payroll</h1>
          <p className="text-sm text-zinc-400">Manage monthly disbursements and salary slips.</p>
        </div>
        <Button variant="primary">Process Payroll</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg"><Users /></div>
          <div><p className="text-sm text-zinc-400">Total Staff</p><p className="text-2xl font-bold text-white">42</p></div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><DollarSign /></div>
          <div><p className="text-sm text-zinc-400">Total Disbursed</p><p className="text-2xl font-bold text-white">$124,500</p></div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg"><AlertCircle /></div>
          <div><p className="text-sm text-zinc-400">Pending Clearances</p><p className="text-2xl font-bold text-white">3</p></div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input type="text" placeholder="Search staff..." className="w-full max-w-md bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-zinc-400 font-medium">Emp ID</th>
              <th className="p-4 text-zinc-400 font-medium">Name</th>
              <th className="p-4 text-zinc-400 font-medium">Role</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Base Salary</th>
              <th className="p-4 text-zinc-400 font-medium text-center">Status</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(staff => (
              <tr key={staff.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-zinc-500">{staff.id}</td>
                <td className="p-4 text-white font-medium">{staff.name}</td>
                <td className="p-4 text-zinc-400">{staff.role}</td>
                <td className="p-4 text-white text-right">${staff.salary.toLocaleString()}</td>
                <td className="p-4 text-center">
                  <Badge variant={staff.status === 'paid' ? 'success' : 'warning'}>{staff.status.toUpperCase()}</Badge>
                </td>
                <td className="p-4 text-right"><Button variant="secondary">View Slip</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
