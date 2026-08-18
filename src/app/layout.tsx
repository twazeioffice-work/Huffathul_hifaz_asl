import React from 'react';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">
        <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <a href="/" className="font-bold text-lg tracking-wide hover:text-emerald-300 transition-colors">
                Suffat-ul Huffaz <span className="text-xs font-normal bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 ml-2">Ecosystem</span>
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
              <a href="/" className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Command Center</a>
              <a href="/app/suffat-hq/main/erp/communication" className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Omnichannel</a>
              <a href="/app/suffat-hq/main/erp/assets" className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Assets & Fleet</a>
              <a href="/app/suffat-hq/main/erp/reports" className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Analytics</a>
              <a href="/app/suffat-hq/main/erp/community" className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">Community</a>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
