"use client";

import { useState } from "react";
import { Shield, Search, Calendar, Filter } from "lucide-react";
import HighDensityAuditLog from "@/components/erp/HighDensityAuditLog";

const mockAuditEntries = [
  {
    id: "a1",
    timestamp: "2026-08-18 16:15:02",
    actor_name: "Admin Khalid",
    action: "CREATE_STUDENT",
    resource: "students/s-0042",
    ip_address: "192.168.1.12",
    metadata: '{"name":"Muhammad Ahmad","class":"Hifz-A"}',
  },
  {
    id: "a2",
    timestamp: "2026-08-18 16:12:45",
    actor_name: "Teacher Fatima",
    action: "UPDATE_SABAQ",
    resource: "sabaq/sbq-1287",
    ip_address: "10.0.0.5",
    metadata: '{"juz":3,"page_start":41,"page_end":45,"grade":"A"}',
  },
  {
    id: "a3",
    timestamp: "2026-08-18 15:58:10",
    actor_name: "System",
    action: "LOGIN_SUCCESS",
    resource: "auth/sessions",
    ip_address: "203.99.12.44",
    metadata: '{"mfa":"totp","device":"iPhone 16 Pro"}',
  },
  {
    id: "a4",
    timestamp: "2026-08-18 15:45:33",
    actor_name: "Admin Khalid",
    action: "DELETE_DRAFT_FEE",
    resource: "billing/inv-draft-0099",
    ip_address: "192.168.1.12",
    metadata: '{"amount":2500,"reason":"duplicate entry"}',
  },
  {
    id: "a5",
    timestamp: "2026-08-18 15:30:01",
    actor_name: "System",
    action: "CREATE_BACKUP",
    resource: "system/backups",
    ip_address: "127.0.0.1",
    metadata: '{"size_mb":142,"type":"incremental"}',
  },
  {
    id: "a6",
    timestamp: "2026-08-18 14:55:22",
    actor_name: "Director Omar",
    action: "UPDATE_AFFILIATION",
    resource: "affiliations/aff-0012",
    ip_address: "172.16.0.8",
    metadata: '{"status":"APPROVED","from":"UNDER_REVIEW"}',
  },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockAuditEntries.filter(
    (e) =>
      e.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          SYSTEM AUDIT TRAIL
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Immutable, append-only activity log. All operations are RLS-scoped to your institution.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by actor, operation, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <button className="flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded text-xs text-muted-foreground hover:border-primary/40 transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          Date Range
        </button>
        <button className="flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded text-xs text-muted-foreground hover:border-primary/40 transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>
      </div>

      {/* Audit Log Table */}
      <HighDensityAuditLog entries={filtered} />
    </div>
  );
}
