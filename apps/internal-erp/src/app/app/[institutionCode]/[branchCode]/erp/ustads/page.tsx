"use client";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, Star, BookOpen } from "lucide-react";

const MOCK_USTADS = [
  { id: "EMP-001", name: "Ahmed Abdullah", halqa: "Hifz Class A", students: 15, rating: 4.8 },
  { id: "EMP-004", name: "Ibrahim Khalid", halqa: "Hifz Class B", students: 12, rating: 4.5 },
  { id: "EMP-005", name: "Yusuf Rahman", halqa: "Nazira Class", students: 20, rating: 4.9 },
];

export default function UstadsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Ustads Management</h1>
          <p className="text-sm text-zinc-400">Manage teaching staff, assigned Halqas, and performance metrics.</p>
        </div>
        <Button variant="primary">Add Ustad</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_USTADS.map(ustad => (
          <GlassCard key={ustad.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-bold">
                {ustad.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{ustad.name}</h3>
                <p className="text-sm text-zinc-400">{ustad.id}</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-400"/> Halqa</div>
                <span className="text-white font-medium">{ustad.halqa}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2"><Users size={16} className="text-indigo-400"/> Students</div>
                <span className="text-white font-medium">{ustad.students} assigned</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2"><Star size={16} className="text-yellow-400"/> Rating</div>
                <span className="text-white font-medium">{ustad.rating} / 5.0</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
              <Button variant="secondary" className="w-full">View Profile</Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
