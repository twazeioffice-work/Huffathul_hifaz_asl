"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, User, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call and token generation
    setTimeout(() => {
      if (email === "admin@suffat.org" && password === "superadmin2026") {
        document.cookie = "access_token=mock_access_token_admin; path=/; max-age=3600";
        document.cookie = "refresh_token=mock_refresh_token; path=/; max-age=86400";
        window.location.href = "/app/suffat/main/erp";
      } else if (email === "nazim@suffat.org" && password === "nazim2026") {
        document.cookie = "access_token=mock_access_token_nazim; path=/; max-age=3600";
        window.location.href = "/app/suffat/main/erp";
      } else if (email === "centeradmin@suffat.org" && password === "center2026") {
        document.cookie = "access_token=mock_access_token_centeradmin; path=/; max-age=3600";
        window.location.href = "/app/suffat/main/erp";
      } else if (email === "ustadh@suffat.org" && password === "ustadh2026") {
        document.cookie = "access_token=mock_access_token_ustadh; path=/; max-age=3600";
        window.location.href = "/app/suffat/main/erp/academics";
      } else if (email === "student@suffat.org" && password === "student2026") {
        document.cookie = "access_token=mock_access_token_student; path=/; max-age=3600";
        window.location.href = "/app/suffat/main/erp/students/1001";
      } else {
        setError("Invalid cryptographic credentials.");
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050506] text-white flex items-center justify-center p-6 font-sans">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0071E3]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10 space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#54A3FF] flex items-center justify-center shadow-2xl shadow-[#0071E3]/30">
            <span className="text-3xl font-black tracking-tight text-white font-mono">S</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-tight">Suffat-ul Huffaz</h1>
            <p className="text-[11px] text-[#86868B] font-mono tracking-widest uppercase mt-1">Enterprise Command Center</p>
          </div>
        </div>

        <div className="bg-[#0F0F12] border border-[#2C2C2E]/60 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-2 mb-8 justify-center">
            <div className="h-2 w-2 rounded-full bg-[#30D158] animate-pulse" />
            <span className="text-xs text-[#30D158] font-mono font-semibold tracking-wider uppercase">Zero-Trust Gateway</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold px-1">Institutional ID</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1C1C1E]/50 border border-[#2C2C2E] rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all text-white placeholder-[#86868B]"
                  placeholder="admin@suffat.org"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold px-1">Cryptographic Key</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1C1C1E]/50 border border-[#2C2C2E] rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all text-white placeholder-[#86868B]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold rounded-xl py-3.5 text-sm flex items-center justify-center space-x-2 hover:bg-[#F5F5F7] transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <>
                  <Activity className="h-4 w-4 animate-pulse text-[#0071E3]" />
                  <span>Authenticating via BFF...</span>
                </>
              ) : (
                <>
                  <span>Initiate Secure Handshake</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] text-[#86868B]">
            Protected by PostgreSQL RLS & Edge JWT Interception.
          </p>
          <div className="flex justify-center space-x-4 text-[10px] text-[#54A3FF]">
            <span className="cursor-pointer hover:underline">Forgot Key?</span>
            <span className="text-[#2C2C2E]">|</span>
            <span className="cursor-pointer hover:underline">Request Access</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
