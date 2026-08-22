"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ShieldAlert, Key, LogOut } from "lucide-react";

export default function SecuritySettingsPage() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "info", message: "Processing cryptographic rotation..." });
    
    try {
      const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getCookie("__Host-Secure-Token") || getCookie("access_token")}`
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });

      if (!response.ok) {
        throw new Error("Password change failed. Check your current password.");
      }

      setStatus({ type: "success", message: "Password updated successfully. Triggering global session revocation..." });
      setTimeout(() => handleRevokeSessions(), 2000);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleRevokeSessions = async () => {
    try {
      await fetch(`${BASE_URL}/auth/revoke-all-sessions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getCookie("__Host-Secure-Token") || getCookie("access_token")}`
        }
      });
      // Clear cookies and force a redirect to login
      document.cookie = "__Host-Secure-Token=; Max-Age=0; path=/;";
      document.cookie = "access_token=; Max-Age=0; path=/;";
      document.cookie = "demo_auth_role=; Max-Age=0; path=/;";
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center items-center p-6">
      <div className="w-full max-w-lg space-y-8">
        
        <div className="text-center space-y-2">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">Security & Revocation</h1>
          <p className="text-muted-foreground text-sm">
            Manage your credentials and global session states.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg shadow-2xl backdrop-blur-glass space-y-6">
          <h2 className="text-xl font-bold flex items-center space-x-2 border-b border-border pb-3">
            <Key className="w-5 h-5 text-primary" />
            <span>Update Password</span>
          </h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {status.message && (
              <div className={`p-3 rounded-md text-xs font-bold ${
                status.type === "success" ? "bg-emerald-500/20 text-emerald-400" :
                status.type === "error" ? "bg-red-500/20 text-red-400" :
                "bg-blue-500/20 text-blue-400"
              }`}>
                {status.message}
              </div>
            )}

            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-md hover:opacity-90 transition-opacity text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              Rotate Cryptographic Key
            </button>
          </form>
        </div>

        <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-lg shadow-2xl space-y-4">
           <h2 className="text-xl font-bold flex items-center space-x-2 text-red-500">
            <LogOut className="w-5 h-5" />
            <span>Global Revocation</span>
          </h2>
          <p className="text-xs text-red-400/80 leading-relaxed">
            Instantly terminate all active sessions across all mobile and desktop devices. This triggers the Token Family Rotation "Nuclear Option" as mandated by our Zero-Trust architecture.
          </p>
          <button 
            onClick={handleRevokeSessions}
            className="w-full bg-red-600/20 border border-red-500 hover:bg-red-600 text-red-100 font-bold py-2 rounded-md transition-all text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            Log out of all active devices
          </button>
        </div>

        <div className="text-center">
            <button onClick={() => window.location.href = `/app/${institutionCode}/${branchCode}/erp`} className="text-muted-foreground text-xs hover:text-primary transition-colors">
                ? Return to Dashboard
            </button>
        </div>

      </div>
    </div>
  );
}

