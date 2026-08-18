import React from 'react';

export default function AssetManagementDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800">Enterprise Assets & Fleet</h1>
        <p className="text-slate-500 mt-2">Track Physical Ledgers, Maintenance, and IoT GPS Data</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Transport Fleet</h2>
          <p className="text-slate-500 mb-4">12 Active Buses • 3 in Maintenance</p>
          <button className="text-sm font-medium text-emerald-600">View Live GPS Map &rarr;</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Real Estate & Dorms</h2>
          <p className="text-slate-500 mb-4">4 Buildings • 150 Rooms Allocated</p>
          <button className="text-sm font-medium text-indigo-600">Manage Allocation &rarr;</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">IT & Hardware</h2>
          <p className="text-slate-500 mb-4">80 Workstations • 12 Printers</p>
          <button className="text-sm font-medium text-amber-600">Run Depreciation &rarr;</button>
        </div>
      </div>
    </div>
  );
}
