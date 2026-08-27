"use client";

import React, { useState, useEffect } from "react";
import { User, Shield, Bell, KeyRound, Save, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUserProfile, updatePassword } from "./actions";

export default function PersonalSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Profile" | "Security" | "Notifications">("Profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getCurrentUserProfile().then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordStatus({ success: false, message: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: "Passwords do not match." });
      return;
    }

    setIsSaving(true);
    setPasswordStatus(null);
    const res = await updatePassword(newPassword);
    setIsSaving(false);

    if (res.success) {
      setPasswordStatus({ success: true, message: "Password successfully updated!" });
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordStatus({ success: false, message: res.error || "Failed to update password." });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-slate-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm gap-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
              title="Go Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <User className="h-6 w-6 text-cyan-600" />
                <span>Account & Personal Settings</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your credentials, active role, and system preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-50 border border-cyan-200 text-cyan-700 rounded-xl text-xs font-mono font-bold">
              Role: {profile?.role || "USER"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab("Profile")} 
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                activeTab === 'Profile' 
                  ? 'bg-white border border-slate-200 text-cyan-700 shadow-sm font-bold' 
                  : 'bg-transparent border border-transparent text-slate-600 hover:bg-white/60'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="text-sm">Personal Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab("Security")} 
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                activeTab === 'Security' 
                  ? 'bg-white border border-slate-200 text-cyan-700 shadow-sm font-bold' 
                  : 'bg-transparent border border-transparent text-slate-600 hover:bg-white/60'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Security & Password</span>
            </button>
            <button 
              onClick={() => setActiveTab("Notifications")} 
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                activeTab === 'Notifications' 
                  ? 'bg-white border border-slate-200 text-cyan-700 shadow-sm font-bold' 
                  : 'bg-transparent border border-transparent text-slate-600 hover:bg-white/60'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="text-sm">Notifications</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[400px]">
            
            {activeTab === "Profile" && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">User Profile Identity</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 text-xl font-bold">
                    {(profile?.name || "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{profile?.name || "Loading..."}</h3>
                    <p className="text-xs text-slate-500 font-mono">{profile?.email || "..."}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      readOnly
                      value={profile?.name || ""}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username / Email</label>
                    <input 
                      type="text" 
                      readOnly
                      value={profile?.email || ""}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assigned Boundary / Branch</label>
                    <input 
                      type="text" 
                      readOnly
                      value={profile?.branchName || "HQ / Central"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">System Role</label>
                    <input 
                      type="text" 
                      readOnly
                      value={profile?.role || "USER"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-800 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Password & Credentials</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {passwordStatus && (
                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      passwordStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {passwordStatus.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
                      <span>{passwordStatus.message}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>{isSaving ? "Updating..." : "Update Password"}</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Notification Preferences</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-sm font-semibold text-slate-800 block">WhatsApp Daily Digest</span>
                      <span className="text-xs text-slate-500">Receive morning student attendance alerts</span>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-cyan-600" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-sm font-semibold text-slate-800 block">Security Alert Emails</span>
                      <span className="text-xs text-slate-500">Notify on login from unfamiliar device or IP</span>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-cyan-600" />
                  </label>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
