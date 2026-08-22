"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successPath, setSuccessPath] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Post credentials to our FastAPI Step 2 Auth Controller (Renamed to /token to bypass any edge cache/WAF)
      const response = await fetch("/api/v1/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username_or_email: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed. Please verify credentials.");
      }

      // 2. Auth Success: The FastAPI backend has synchronously set the secure, HttpOnly, 
      //    SameSite=Strict cookie containing our multi-tenant JWT token.
      setSuccessPath(data.redirect_url);
      
      // 3. Perform soft, animated router redirection to their dynamic landing path
      setTimeout(() => {
        router.push(data.redirect_url);
      }, 800);

    } catch (err: any) {
      setErrorMsg(err.message || "A network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex items-center justify-center relative overflow-hidden font-sans">
      {/* 1. Glassmorphic Radial Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full filter blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-500/10 rounded-full filter blur-[120px] animate-pulse" />

      {/* 2. Main Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Apple Spring curve
        className="w-full max-w-[420px] p-8 mx-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl relative z-10 border border-white/10"
      >
        {/* logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-[#00F0FF] p-[1px] mb-4">
            <div className="w-full h-full bg-[#050506] rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-[#00F0FF] bg-clip-text text-transparent">SH</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Suffat-ul Huffaz</h1>
          <p className="text-sm text-neutral-400 mt-1">Unified Digital Gateway & ERP Portal</p>
        </div>

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || !!successPath}
              className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#222226] focus:border-[#00F0FF] rounded-lg text-base text-white placeholder-white/20 transition duration-150 ease-in-out outline-none focus:ring-1 focus:ring-[#00F0FF]"
              placeholder="name@suffat.org"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5 tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || !!successPath}
              className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#222226] focus:border-[#00F0FF] rounded-lg text-base text-white placeholder-white/20 transition duration-150 ease-in-out outline-none focus:ring-1 focus:ring-[#00F0FF]"
              placeholder="••••••••"
            />
          </div>

          {/* Animate Errors and Feedback */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2.5 text-sm text-red-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <p className="flex-1">{errorMsg}</p>
              </motion.div>
            )}

            {successPath && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2.5 text-sm text-emerald-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <p className="flex-1">Verification secure. Access granted, redirecting...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={isLoading || !!successPath}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition duration-150 font-medium text-base text-white disabled:opacity-40 disabled:hover:bg-blue-600 relative overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>SECUREING CHANNEL...</span>
              </div>
            ) : (
              <span>SIGN IN</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
