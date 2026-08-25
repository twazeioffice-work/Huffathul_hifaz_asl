"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bell, CheckCircle2, ArrowRight, Settings, Filter, Trash2, Mail, ShieldAlert, FileText, CheckCircle, Clock } from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  const { institutionCode, branchCode } = useParams();

  const [notifications] = useState([
    {
      id: "NOT-001",
      title: "New Welfare Case Assigned",
      body: "You have been assigned to review case WLF-24-08 for student Abdullah Siddiqui.",
      type: "WELFARE_CASE_CREATED",
      isRead: false,
      time: "10 mins ago",
    },
    {
      id: "NOT-002",
      title: "SLA Breach Warning",
      body: "Expense Request EXP-001 has been pending for over 72 hours. Please review immediately.",
      type: "SLA_BREACH",
      isRead: false,
      time: "2 hours ago",
    },
    {
      id: "NOT-003",
      title: "Offline Sync Completed",
      body: "78 attendance records and 12 fee collections were successfully synchronized with HQ.",
      type: "SYNC_COMPLETED",
      isRead: true,
      time: "1 day ago",
    },
  ]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'WELFARE_CASE_CREATED': return <ShieldAlert className="h-5 w-5 text-rose-400" />;
      case 'SLA_BREACH': return <Clock className="h-5 w-5 text-amber-400" />;
      case 'SYNC_COMPLETED': return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      default: return <Bell className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-800 p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
            <Bell className="h-6 w-6 text-blue-400" />
            <span>Notification Inbox</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your system alerts, reminders, and requests</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-slate-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-[rgba(255,255,255,0.1)] flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.05)] rounded-xl p-2">
        <div className="flex space-x-1">
          <button className="px-4 py-1.5 bg-[rgba(255,255,255,0.08)] rounded-lg text-sm font-medium text-slate-200 transition-colors">All</button>
          <button className="px-4 py-1.5 hover:bg-[rgba(255,255,255,0.05)] rounded-lg text-sm font-medium text-slate-500 transition-colors">Unread (2)</button>
          <button className="px-4 py-1.5 hover:bg-[rgba(255,255,255,0.05)] rounded-lg text-sm font-medium text-slate-500 transition-colors">Approvals</button>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg text-slate-500 transition-colors"><Filter className="h-4 w-4" /></button>
          <button className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg text-rose-400/70 hover:text-rose-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className={`p-4 rounded-xl border flex items-start space-x-4 transition-all duration-300 cursor-pointer ${
              notif.isRead 
                ? 'bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.03)] opacity-70 hover:opacity-100' 
                : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
          >
            <div className={`p-2 rounded-full mt-1 ${notif.isRead ? 'bg-[rgba(255,255,255,0.05)]' : 'bg-slate-800'}`}>
              {getIconForType(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-sm ${notif.isRead ? 'text-slate-600 font-medium' : 'text-slate-100 font-bold'}`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">{notif.time}</span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                {notif.body}
              </p>
            </div>
            {!notif.isRead && (
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 self-center animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
