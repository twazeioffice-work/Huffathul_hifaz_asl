"use client";

import { Shield, Clock, User, Activity } from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor_name: string;
  action: string;
  resource: string;
  ip_address: string;
  metadata: string;
}

interface HighDensityAuditLogProps {
  entries: AuditEntry[];
}

export default function HighDensityAuditLog({ entries }: HighDensityAuditLogProps) {
  const getActionColor = (action: string) => {
    if (action.includes("CREATE")) return "text-green-400";
    if (action.includes("DELETE")) return "text-red-400";
    if (action.includes("UPDATE")) return "text-yellow-400";
    if (action.includes("LOGIN")) return "text-cyan-400";
    return "text-muted-foreground";
  };

  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-primary">IMMUTABLE SYSTEM AUDIT TRAIL</h3>
        </div>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">
          {entries.length} ENTRIES
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-card/60">
              <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Timestamp</th>
              <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Actor</th>
              <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Operation</th>
              <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Resource</th>
              <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">IP Address</th>
              <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-border/50 hover:bg-primary/5 transition-colors"
              >
                <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {entry.timestamp}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-white">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-primary" />
                    {entry.actor_name}
                  </div>
                </td>
                <td className={`px-4 py-2.5 font-bold ${getActionColor(entry.action)}`}>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    {entry.action}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{entry.resource}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{entry.ip_address}</td>
                <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">
                  {entry.metadata}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
