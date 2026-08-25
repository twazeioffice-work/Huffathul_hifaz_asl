"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, MapPin, GraduationCap, Briefcase, Plus, Filter, 
  Search, ShieldCheck, Mail, Phone, ChevronRight 
} from "lucide-react";

export default function GlobalAlumniRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Mocked global alumni data, protected by RLS
  const alumniList = [
    {
      id: "ALUM-2023-001",
      name: "Ahmed Raza Khan",
      gradYear: 2023,
      hifzPara: 30,
      location: "London, UK",
      career: "Software Engineer @ TechCorp",
      education: "MSc Computer Science, Imperial College",
      piiAccess: false,
    },
    {
      id: "ALUM-2021-145",
      name: "Zaid Abdullah",
      gradYear: 2021,
      hifzPara: 30,
      location: "Dubai, UAE",
      career: "Imam & Regional Director",
      education: "BA Islamic Studies, Al-Azhar",
      piiAccess: true,
      email: "zaid.abd@example.com",
      phone: "+971 50 123 4567"
    },
    {
      id: "ALUM-2024-089",
      name: "Tariq Jameel",
      gradYear: 2024,
      hifzPara: 30,
      location: "Mumbai, India",
      career: "Entrepreneur",
      education: "BBA, Mumbai University",
      piiAccess: false,
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-black font-semibold p-6 space-y-6">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-cyan-500/10 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase block mb-1 flex items-center">
            <Users className="h-3 w-3 mr-1" /> Phase 8: Community Hub
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black font-semibold flex items-center">
            Global Alumni Registry
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1 max-w-2xl">
            A zero-trust protected, multi-tenant directory of all graduates. PII (contact details) are AES-256-GCM encrypted at rest and require active multi-factor authorization to view.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-black font-medium border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center shadow-lg">
            <Filter className="h-4 w-4 mr-2 text-cyan-400" /> Filter
          </button>
          <button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center shadow-glow-cyan">
            <Plus className="h-4 w-4 mr-2" /> Register Alumni
          </button>
        </div>
      </div>

      {/* Security Context Banner */}
      <div className="bg-[#0C1236]/80 border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black font-semibold uppercase">Tenant Isolation Active</h4>
            <p className="text-[10px] text-slate-700 font-medium mt-0.5">
              Row-Level Security (RLS) is engaged. You are viewing records strictly bounded to your institutional jurisdiction.
            </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900">
            TLS 1.3 Transport Envelope
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-700 font-medium" />
        <input 
          type="text" 
          placeholder="Search by name, city, or graduation year..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0B0F27] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-black font-medium focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800 font-medium"
        />
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumniList.map(alumni => (
          <div 
            key={alumni.id} 
            className="bg-[#0D1334]/50 border border-slate-200 hover:border-cyan-500/40 rounded-2xl p-5 transition-all group relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-black font-semibold group-hover:text-cyan-300 transition-colors">
                  {alumni.name}
                </h3>
                <span className="text-xs font-mono text-slate-700 font-medium mt-1 block">
                  {alumni.id}
                </span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md">
                Class of {alumni.gradYear}
              </div>
            </div>

            {/* Meta details */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center text-xs text-slate-800 font-medium">
                <MapPin className="h-3.5 w-3.5 mr-2 text-cyan-400" />
                {alumni.location}
              </div>
              <div className="flex items-center text-xs text-slate-800 font-medium">
                <Briefcase className="h-3.5 w-3.5 mr-2 text-amber-400" />
                {alumni.career}
              </div>
              <div className="flex items-center text-xs text-slate-800 font-medium">
                <GraduationCap className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                {alumni.education}
              </div>
            </div>

            {/* PII / Contact Block (Encryption Demo) */}
            <div className="pt-4 border-t border-slate-200">
              {alumni.piiAccess ? (
                <div className="space-y-2">
                  <div className="flex items-center text-[11px] text-slate-700 font-medium">
                    <Mail className="h-3 w-3 mr-2" /> {alumni.email}
                  </div>
                  <div className="flex items-center text-[11px] text-slate-700 font-medium">
                    <Phone className="h-3 w-3 mr-2" /> {alumni.phone}
                  </div>
                </div>
              ) : (
                <div className="bg-[#0B0F27] border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-700 font-medium flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1.5" /> PII Encrypted (AES-256)
                  </span>
                  <button className="text-[10px] text-cyan-400 font-semibold hover:text-cyan-300 flex items-center">
                    Request Access <ChevronRight className="h-3 w-3 ml-0.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
