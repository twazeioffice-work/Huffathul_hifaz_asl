"use client";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, Settings, Send, CheckCircle2 } from "lucide-react";

export default function WhatsAppPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black font-semibold">WhatsApp Integration</h1>
          <p className="text-sm text-slate-700 font-medium">Automated messaging, broadcast lists, and API configuration.</p>
        </div>
        <Button variant="secondary" className="flex gap-2 items-center"><Settings size={16}/> API Settings</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 md:col-span-1 border-green-500/30 bg-green-500/5 flex flex-col items-center text-center justify-center">
          <CheckCircle2 size={48} className="text-green-400 mb-4" />
          <h3 className="text-lg font-bold text-black font-semibold">API Connected</h3>
          <p className="text-sm text-slate-700 font-medium mt-2">Twilio/Meta WhatsApp API is active and receiving webhooks.</p>
          <Badge variant="success" className="mt-4">Live</Badge>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2">
          <h3 className="text-lg font-bold text-black font-semibold mb-4">Quick Broadcast</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 font-medium mb-2">Target Audience</label>
              <select className="w-full bg-black/5 border border-slate-200 rounded-md px-3 py-2 text-black font-semibold">
                <option>All Parents</option>
                <option>All Staff</option>
                <option>Specific Halqa Parents</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 font-medium mb-2">Message Template</label>
              <textarea rows={4} className="w-full bg-black/5 border border-slate-200 rounded-md px-3 py-2 text-black font-semibold" defaultValue="Assalamu Alaikum. This is a reminder regarding..."></textarea>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" className="flex gap-2 items-center"><Send size={16}/> Send Broadcast</Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
