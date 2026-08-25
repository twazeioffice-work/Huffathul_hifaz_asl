"use client";

import React from "react";
import { Settings, Save, MapPin, Calendar, Users, Building, MessageSquare, Coffee, Car } from "lucide-react";

export default function BranchSettingsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-800 p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
            <Building className="h-6 w-6 text-indigo-400" />
            <span>Branch Settings</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure academic terms, fee structures, and local integrations</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center space-x-3 p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-slate-200 transition-colors">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">Branch Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-500 hover:text-slate-200 transition-colors">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">Academic Year</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-500 hover:text-slate-200 transition-colors">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">Batches & Halqas</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-500 hover:text-slate-200 transition-colors">
            <MessageSquare className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">WhatsApp Templates</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-500 hover:text-slate-200 transition-colors">
            <Coffee className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">Hostel & Kitchen</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.05)] rounded-xl text-slate-500 hover:text-slate-200 transition-colors">
            <Car className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">Transport Settings</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 backdrop-blur-xl min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Branch Profile</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Branch Name</label>
              <input 
                type="text" 
                defaultValue="Malappuram Main Campus"
                className="w-full bg-black/5 border border-slate-200 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contact Number</label>
              <input 
                type="text" 
                defaultValue="+91 98765 43210"
                className="w-full bg-black/5 border border-slate-200 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
              <select className="w-full bg-black/5 border border-slate-200 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none">
                <option value="IST">Asia/Kolkata (IST)</option>
                <option value="GST">Asia/Dubai (GST)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
