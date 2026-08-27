"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Users, Star, BookOpen } from "lucide-react";
import { getUstadsMetrics } from "../actions";

export default function UstadsPage() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [ustads, setUstads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (institutionCode && branchCode) {
      getUstadsMetrics(institutionCode, branchCode).then(data => {
        setUstads(data?.ustadsList || []);
        setLoading(false);
      });
    }
  }, [institutionCode, branchCode]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black font-semibold">Ustads Management</h1>
          <p className="text-sm text-slate-700 font-medium">Manage teaching staff, assigned Halqas, and academic assignments ({ustads.length} Ustads shown).</p>
        </div>
        <Button variant="primary" onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/staff/register`}>Add Ustad</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ustads.map(ustad => (
          <GlassCard key={ustad.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 text-xl font-bold font-mono">
                {ustad.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-black font-semibold">{ustad.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{ustad.email}</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between text-slate-800 font-medium">
                <div className="flex items-center gap-2"><BookOpen size={16} className="text-cyan-600"/> Branch</div>
                <span className="text-black font-semibold text-xs font-mono">{ustad.branchName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-800 font-medium">
                <div className="flex items-center gap-2"><Users size={16} className="text-cyan-600"/> Assigned Students</div>
                <span className="text-black font-semibold text-xs font-mono">{ustad.students} Students</span>
              </div>
              <div className="flex items-center justify-between text-slate-800 font-medium">
                <div className="flex items-center gap-2"><Star size={16} className="text-amber-500"/> Performance</div>
                <span className="text-black font-semibold text-xs font-mono">{ustad.rating} / 5.0</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-2">
              <Button variant="secondary" className="w-full" onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp/staff-payroll`}>View Payroll</Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
