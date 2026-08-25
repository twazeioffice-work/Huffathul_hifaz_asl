"use client";

import React, { useState } from "react";
import { Database, Search, Filter, Download, Monitor, Smartphone, Globe } from "lucide-react";

export default function AuditLogsPage() {
  const [logs] = useState([
    {
      id: 1,
      time: "2026-08-24 10:42:15",
      user: "m.ali@suffat.org",
      action: "UPDATE",
      entity: "Student Record",
      oldValue: "Status: Pending",
      newValue: "Status: Active",
      ip: "192.168.1.45",
      device: "MacBook Pro (Chrome)",
      type: "desktop"
    },
    {
      id: 2,
      time: "2026-08-24 09:15:22",
      user: "admin_aa59cbc5f3@suffat.com",
      action: "DELETE",
      entity: "Fee Voucher",
      oldValue: "Amount: ₹4,500",
      newValue: "Deleted",
      ip: "103.45.67.89",
      device: "iPhone 14 (Safari)",
      type: "mobile"
    },
    {
      id: 3,
      time: "2026-08-23 16:30:00",
      user: "system_cron",
      action: "SYSTEM_BACKUP",
      entity: "Database",
      oldValue: "-",
      newValue: "Backup Completed (4.2GB)",
      ip: "localhost",
      device: "Server Node 01",
      type: "server"
    },
  ]);

  return (
    <div className="min-h-screen bg-[#09090b] text-black font-semibold p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
            <Database className="h-6 w-6 text-orange-400" />
            <span>System Audit Logs</span>
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">Immutable trail of all security events and critical modifications.</p>
        </div>
        <button className="bg-black/5 hover:bg-white/20 text-black font-semibold px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-slate-700 font-medium" />
          <input 
            type="text" 
            placeholder="Search by User, Action, or Entity..." 
            className="w-full bg-black/5 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-black/5 border border-slate-200 rounded-xl py-2 px-4 text-sm text-slate-800 font-medium focus:outline-none appearance-none">
            <option>All Modules</option>
            <option>Students</option>
            <option>Finance</option>
            <option>Settings</option>
          </select>
          <select className="bg-black/5 border border-slate-200 rounded-xl py-2 px-4 text-sm text-slate-800 font-medium focus:outline-none appearance-none">
            <option>All Actions</option>
            <option>CREATE</option>
            <option>UPDATE</option>
            <option>DELETE</option>
          </select>
          <button className="p-2 bg-black/5 hover:bg-black/5 border border-slate-200 rounded-xl text-slate-800 font-medium transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800 font-medium">
            <thead className="bg-black/5 text-xs uppercase font-semibold text-slate-700 font-medium">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User / Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Changes</th>
                <th className="px-6 py-4">Network / Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium font-mono text-xs">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-blue-300">{log.user}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider ${
                      log.action === 'UPDATE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      log.action === 'DELETE' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-200">{log.entity}</td>
                  <td className="px-6 py-4 min-w-[250px]">
                    <div className="flex flex-col space-y-1 text-xs">
                      <span className="text-slate-700 font-medium line-through">{log.oldValue}</span>
                      <span className="text-emerald-400">{log.newValue}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-medium">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" /> <span>{log.ip}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {log.type === 'mobile' ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                        <span>{log.device}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
