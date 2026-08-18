"use client";

import { useState } from "react";
import { Plus, Search, Filter, ShieldCheck, MapPin, Truck } from "lucide-react";

const mockAssets = [
  {
    id: "uuid-1",
    code: "SUH-VH-001",
    name: "Toyota Hiace Commuter 2024",
    category_name: "Fleet Vehicles",
    acquisition_cost: 45000.0,
    current_book_value: 38250.0,
    status: "active",
  },
  {
    id: "uuid-2",
    code: "SUH-LD-102",
    name: "North Branch Campus Land",
    category_name: "Real Estate",
    acquisition_cost: 1250000.0,
    current_book_value: 1250000.0, // Land doesn't depreciate
    status: "active",
  },
  {
    id: "uuid-3",
    code: "SUH-IT-405",
    name: "Server Rack Array (Alpha)",
    category_name: "IT Infrastructure",
    acquisition_cost: 15000.0,
    current_book_value: 9000.0,
    status: "maintenance",
  },
];

export default function AssetsPage({ params }: { params: { institutionCode: string; branchCode: string } }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssets = mockAssets.filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            PHYSICAL ASSET LEDGER
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Comprehensive tracking of land, buildings, and branch vehicle fleet.
          </p>
        </div>

        {/* In production this is wrapped in a CheckPermission component */}
        <button className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold px-4 py-2.5 rounded transition-colors shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <Plus className="w-4 h-4" />
          REGISTER PHYSICAL ASSET
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href={`/app/${params.institutionCode}/${params.branchCode}/erp/assets/fleet`}
          className="glass-panel border border-border rounded-lg p-5 text-left hover:border-primary/40 transition-colors group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                Fleet Telemetry
              </h3>
              <p className="text-[10px] text-muted-foreground">Live GPS tracking map</p>
            </div>
          </div>
        </a>

        <div className="glass-panel border border-border rounded-lg p-5">
          <h3 className="text-sm font-bold text-muted-foreground">Total Book Value</h3>
          <p className="text-2xl font-bold text-emerald-400 mt-2">$1,297,250.00</p>
        </div>

        <div className="glass-panel border border-border rounded-lg p-5">
          <h3 className="text-sm font-bold text-muted-foreground">Active Assets</h3>
          <p className="text-2xl font-bold text-white mt-2">142</p>
        </div>
      </div>

      <div className="glass-panel rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-card border border-border px-4 py-2 rounded text-xs text-muted-foreground hover:border-primary/40 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-card/60">
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Asset Code</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Asset Name</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Category</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Acquisition Cost</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Book Value</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary font-bold">{asset.code}</td>
                  <td className="px-4 py-3 text-white font-semibold">{asset.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{asset.category_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">${asset.acquisition_cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">${asset.current_book_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        asset.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {asset.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
