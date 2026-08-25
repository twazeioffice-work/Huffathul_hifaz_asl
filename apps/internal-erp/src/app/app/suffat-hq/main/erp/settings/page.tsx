"use client";

import React from "react";
import { Settings, Shield, Globe, Database, Activity, Lock, Users, Save } from "lucide-react";

export default function SuperAdminSettingsPage() {
  return (
    <div className="min-h-screen bg-transparent text-black font-semibold p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black font-semibold flex items-center space-x-2">
            <Shield className="h-6 w-6 text-red-500" />
            <span>Super Admin Settings</span>
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">Global configuration, security, and system integrations</p>
        </div>
        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-red-900/20 flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center space-x-3 p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-black font-medium transition-colors">
            <Globe className="h-4 w-4 text-slate-700 font-medium" />
            <span className="text-sm font-medium">Institutions & Branches</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-700 font-medium hover:text-black font-medium transition-colors">
            <Users className="h-4 w-4 text-slate-700 font-medium" />
            <span className="text-sm font-medium">Global Roles & Junction</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-700 font-medium hover:text-black font-medium transition-colors">
            <Lock className="h-4 w-4 text-slate-700 font-medium" />
            <span className="text-sm font-medium">Permission Matrix</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-700 font-medium hover:text-black font-medium transition-colors">
            <Database className="h-4 w-4 text-slate-700 font-medium" />
            <span className="text-sm font-medium">Audit Logs & Backup</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-700 font-medium hover:text-black font-medium transition-colors">
            <Activity className="h-4 w-4 text-slate-700 font-medium" />
            <span className="text-sm font-medium">System Health & Integrations</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-xl min-h-[400px]">
          <h2 className="text-lg font-bold text-black font-semibold mb-4">Institutions & Branches</h2>
          <div className="space-y-4">
            <div className="p-4 bg-black/5 border border-slate-200 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-black font-medium">Global Tenant Lock</h3>
                  <p className="text-xs text-slate-700 font-medium mt-1">Prevent new branch creation temporarily across the ecosystem.</p>
                </div>
                <div className="w-10 h-5 bg-slate-700 rounded-full flex items-center p-1 cursor-pointer">
                  <div className="w-3.5 h-3.5 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-black/5 border border-slate-200 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-black font-medium">Enforce 2FA Globally</h3>
                  <p className="text-xs text-slate-700 font-medium mt-1">Require two-factor authentication for all Admin and Nazim roles.</p>
                </div>
                <div className="w-10 h-5 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-end p-1 cursor-pointer">
                  <div className="w-3.5 h-3.5 bg-red-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
