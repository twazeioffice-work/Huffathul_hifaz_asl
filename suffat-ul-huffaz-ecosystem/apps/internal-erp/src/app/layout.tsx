import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'Suffat-ul Huffaz Command Center',
  description: 'Enterprise Multi-Tenant Digital LMS & ERP Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0F1D] text-slate-100 font-sans antialiased min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-sm shadow-glow-cyan">
                S
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-[#0A0F1D]"></span>
              </div>
              <div>
                <a href="/" className="font-bold text-base tracking-wide text-white flex items-center gap-2 hover:text-cyan-300 transition-colors">
                  Suffat-ul Huffaz
                  <span className="text-[10px] font-semibold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    HQ Enterprise
                  </span>
                </a>
              </div>
            </div>

            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold">
              <a href="/" className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all">
                Command Center
              </a>
              <a href="/app/suffat-hq/main/erp/communication" className="px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/30 transition-all">
                Omnichannel Gateway
              </a>
              <a href="/app/suffat-hq/main/erp/assets" className="px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all">
                Assets & Fleet
              </a>
              <a href="/app/suffat-hq/main/erp/reports" className="px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/30 transition-all">
                Analytics
              </a>
              <a href="/app/suffat-hq/main/erp/community" className="px-3 py-2 rounded-lg text-slate-300 hover:text-indigo-300 hover:bg-indigo-950/40 border border-transparent hover:border-indigo-500/30 transition-all">
                Community Hub
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Mesh: <strong className="text-slate-200 font-mono">Online (3 Nodes)</strong></span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 font-mono">
                v2.4-Prod
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
