"use client";

import React, { useState } from "react";
import { User, Shield, Bell, Moon, Languages, Save, Smartphone, Monitor, Globe, LogOut } from "lucide-react";

export default function PersonalSettingsPage() {
  const [activeTab, setActiveTab] = useState("Security");
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
              <User className="h-6 w-6 text-emerald-400" />
              <span>Personal Settings</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage your profile, security, and preferences</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <div className="md:col-span-1 space-y-2">
            <button onClick={() => setActiveTab("Profile")} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'Profile' ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-slate-200' : 'hover:bg-[rgba(255,255,255,0.02)] border border-transparent text-slate-400 hover:text-slate-200'}`}>
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Profile</span>
            </button>
            <button onClick={() => setActiveTab("Security")} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'Security' ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-slate-200' : 'hover:bg-[rgba(255,255,255,0.02)] border border-transparent text-slate-400 hover:text-slate-200'}`}>
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium">Security</span>
            </button>
            <button onClick={() => setActiveTab("Notifications")} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${activeTab === 'Notifications' ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-slate-200' : 'hover:bg-[rgba(255,255,255,0.02)] border border-transparent text-slate-400 hover:text-slate-200'}`}>
              <Bell className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Notifications</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-400 hover:text-slate-200 transition-colors">
              <Languages className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Language</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-400 hover:text-slate-200 transition-colors">
              <Moon className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Theme</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-xl min-h-[400px]">
            
            {activeTab === "Profile" && (
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-2xl font-bold">
                      MA
                    </div>
                    <div>
                      <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="Mohammed Ali"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="m.ali@suffat.org"
                        disabled
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-3 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 mb-2">Two-Factor Authentication (MFA)</h2>
                  <p className="text-sm text-slate-400 mb-4">Add an extra layer of security to your account. Required for Admin roles.</p>
                  
                  <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${mfaEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Authenticator App</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Use Google Authenticator or Authy</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setMfaEnabled(!mfaEnabled)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${mfaEnabled ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                    >
                      {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-100 mb-2">Active Sessions</h2>
                  <p className="text-sm text-slate-400 mb-4">Manage and revoke your active logins across devices.</p>
                  
                  <div className="space-y-3">
                    {/* Current Session */}
                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Monitor className="h-5 w-5 text-emerald-400" />
                        <div>
                          <h3 className="text-sm font-semibold text-emerald-300">MacBook Pro - Current Session</h3>
                          <div className="flex items-center space-x-2 text-xs text-emerald-500/70 mt-0.5">
                            <Globe className="h-3 w-3" /> <span>Bengaluru, India (192.168.1.45)</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Now</span>
                    </div>

                    {/* Other Session */}
                    <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-slate-500" />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-300">iPhone 14 Pro Max</h3>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                            <Globe className="h-3 w-3" /> <span>Mumbai, India (103.45.67.89)</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-rose-500/10 rounded-lg group transition-colors" title="Revoke Session">
                        <LogOut className="h-4 w-4 text-slate-500 group-hover:text-rose-400" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "Notifications" && (
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-2">Notification Preferences</h2>
                <p className="text-sm text-slate-400 mb-4">Notification settings UI goes here.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
