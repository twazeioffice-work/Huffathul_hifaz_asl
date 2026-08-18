import React from 'react';
import { CheckPermission } from '../components/CheckPermission';

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800">Suffat-ul Huffaz Command Center</h1>
        <p className="text-slate-500 mt-2">Enterprise Multi-Tenant Dashboard</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Admissions Queue</h2>
          <p className="text-slate-500 mb-4">14 pending review</p>
          <button className="text-sm font-medium text-teal-600 hover:text-teal-700">Review Applications &rarr;</button>
        </div>

        <CheckPermission requiredRole="FINANCE_MANAGER">
          <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-emerald-800">Financial Ledger</h2>
            <p className="text-emerald-600 mb-4">Monthly Revenue: $14,200</p>
            <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800">Open Vault &rarr;</button>
          </div>
        </CheckPermission>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Active Branches</h2>
          <p className="text-slate-500 mb-4">3 Regional Campuses Online</p>
          <button className="text-sm font-medium text-teal-600 hover:text-teal-700">View Node Mesh &rarr;</button>
        </div>
      </div>
    </div>
  );
}
