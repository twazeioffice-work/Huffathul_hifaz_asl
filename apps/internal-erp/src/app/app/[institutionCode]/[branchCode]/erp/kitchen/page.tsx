"use client";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Utensils, AlertTriangle, Plus } from "lucide-react";

const MOCK_INVENTORY = [
  { id: "INV-001", item: "Basmati Rice (50kg)", qty: 12, min: 5, status: "healthy" },
  { id: "INV-002", item: "Cooking Oil (10L)", qty: 3, min: 5, status: "low" },
  { id: "INV-003", item: "Wheat Flour (20kg)", qty: 0, min: 3, status: "out" },
];

export default function KitchenPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Kitchen & Inventory</h1>
          <p className="text-sm text-zinc-400">Manage mess inventory, grocery stock levels, and consumption.</p>
        </div>
        <Button variant="primary" className="flex gap-2 items-center"><Plus size={16}/> Add Stock</Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-zinc-400 font-medium">Item Code</th>
              <th className="p-4 text-zinc-400 font-medium">Description</th>
              <th className="p-4 text-zinc-400 font-medium text-center">Current Qty</th>
              <th className="p-4 text-zinc-400 font-medium text-center">Min Threshold</th>
              <th className="p-4 text-zinc-400 font-medium">Status</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVENTORY.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-zinc-500">{item.id}</td>
                <td className="p-4 text-white font-medium">{item.item}</td>
                <td className="p-4 text-white text-center font-bold">{item.qty}</td>
                <td className="p-4 text-zinc-400 text-center">{item.min}</td>
                <td className="p-4">
                  <Badge variant={item.status === 'healthy' ? 'success' : item.status === 'low' ? 'warning' : 'danger'}>
                    {item.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="secondary" className="px-3 py-1 text-xs">Update Qty</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
