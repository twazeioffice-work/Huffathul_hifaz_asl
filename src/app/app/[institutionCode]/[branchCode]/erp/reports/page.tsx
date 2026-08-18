import React from 'react';

export default function AnalyticsDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Advanced Analytics</h1>
          <p className="text-slate-500 mt-2">Financial & Academic Insights</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            Download PDF Report
          </button>
        </div>
      </header>

      {/* Mock Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col justify-center items-center text-slate-400">
          <p>Financial Revenue Over Time (Chart.js Map)</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col justify-center items-center text-slate-400">
          <p>Hifz Completion Rates by Cohort</p>
        </div>
      </div>
    </div>
  );
}
