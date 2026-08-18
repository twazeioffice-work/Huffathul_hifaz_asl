import React from 'react';

export default function CommunityDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800">Community & Affiliations</h1>
        <p className="text-slate-500 mt-2">Manage Alumni, Events, and Institutional Partnerships</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Pending Affiliations</h2>
          <p className="text-slate-500 mb-4">2 Institutes requesting verification</p>
          <button className="text-sm font-medium text-teal-600 hover:text-teal-700">Review Requests &rarr;</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Alumni Network</h2>
          <p className="text-slate-500 mb-4">1,450 Registered Alumni</p>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Broadcast Message &rarr;</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Upcoming Competitions</h2>
          <p className="text-slate-500 mb-4">Annual Hifz Event (Oct 15)</p>
          <button className="text-sm font-medium text-teal-600 hover:text-teal-700">Manage Event &rarr;</button>
        </div>
      </div>
    </div>
  );
}
