"use client";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Truck, Wrench, Calendar, MapPin } from "lucide-react";

const MOCK_FLEET = [
  { id: "BUS-01", type: "Toyota Coaster", plate: "HIFZ-123", status: "active", nextService: "2026-09-15", route: "Downtown Route" },
  { id: "BUS-02", type: "Nissan Civilian", plate: "HIFZ-456", status: "maintenance", nextService: "2026-08-25", route: "N/A" },
  { id: "VAN-01", type: "Toyota Hiace", plate: "HIFZ-789", status: "active", nextService: "2026-10-01", route: "Suburbs" },
];

export default function AssetsFleetPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assets & Fleet</h1>
          <p className="text-sm text-slate-500">Track institutional vehicles, maintenance, and routes.</p>
        </div>
        <Button variant="primary">Register Asset</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_FLEET.map(vehicle => (
          <GlassCard key={vehicle.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{vehicle.id}</h3>
                <p className="text-sm text-slate-500">{vehicle.type}</p>
              </div>
              <Badge variant={vehicle.status === 'active' ? 'success' : 'warning'}>{vehicle.status.toUpperCase()}</Badge>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3 text-slate-600">
                <Truck size={16} className="text-indigo-400"/> <span>{vehicle.plate}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={16} className="text-indigo-400"/> <span>{vehicle.route}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Wrench size={16} className="text-indigo-400"/> <span>Service: {vehicle.nextService}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 flex gap-2">
              <Button variant="secondary" className="w-full">Log Trip</Button>
              <Button variant="secondary" className="w-full">Maintenance</Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
