"use client";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, Search, MessageSquare } from "lucide-react";

const MOCK_COMPLAINTS = [
  { id: "TKT-101", from: "Parent (STU-001)", subject: "Transport Delay", severity: "medium", status: "open", date: "Today" },
  { id: "TKT-102", from: "Ustad (EMP-001)", subject: "AC Malfunction in Halqa 3", severity: "high", status: "investigating", date: "Yesterday" },
  { id: "TKT-103", from: "Anonymous", subject: "Cafeteria Food Quality", severity: "low", status: "resolved", date: "Aug 15" },
];

export default function ComplaintsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Complaints & Grievances</h1>
          <p className="text-sm text-slate-500">Centralized ticket management and resolution system.</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/5 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-500 font-medium">Ticket ID</th>
              <th className="p-4 text-slate-500 font-medium">Reporter</th>
              <th className="p-4 text-slate-500 font-medium">Subject</th>
              <th className="p-4 text-slate-500 font-medium">Severity</th>
              <th className="p-4 text-slate-500 font-medium">Status</th>
              <th className="p-4 text-slate-500 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPLAINTS.map(ticket => (
              <tr key={ticket.id} className="border-b border-slate-200 hover:bg-black/5">
                <td className="p-4 text-slate-500">{ticket.id}</td>
                <td className="p-4 text-slate-800">{ticket.from}</td>
                <td className="p-4 text-slate-800 font-medium">{ticket.subject}</td>
                <td className="p-4">
                  <Badge variant={ticket.severity === 'high' ? 'danger' : ticket.severity === 'medium' ? 'warning' : 'default'}>
                    {ticket.severity.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant={ticket.status === 'resolved' ? 'success' : ticket.status === 'investigating' ? 'warning' : 'danger'}>
                    {ticket.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="secondary" className="px-3 py-1 text-xs">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
