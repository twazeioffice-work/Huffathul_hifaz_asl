"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, Award, Phone } from "lucide-react";

export default function ParentPortalPage() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider">Parent Guardian Portal</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Warder & Guardian Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Live student academic progress and fee transparency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link 
          href={`/app/${institutionCode}/${branchCode}/portal/parent/notices`}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200 flex items-center gap-4"
        >
          <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Campus Announcements</h3>
            <p className="text-xs text-slate-500 mt-0.5">View center notifications, exams, and holidays.</p>
          </div>
        </Link>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Direct Ustad Hotline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Connect with assigned class teacher during office hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
