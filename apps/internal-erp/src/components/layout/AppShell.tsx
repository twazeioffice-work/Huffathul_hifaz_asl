"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  SUPER_ADMIN_NAV,
  CENTER_ADMIN_NAV,
  NAZIM_NAV,
  USTAD_COMMAND_STRIP,
  PORTAL_NAV,
  Role
} from "@/lib/navigation";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, User, FileText, Settings, X, Command } from "lucide-react";

export default function AppShell({
  role,
  children,
  institutionCode,
  branchCode,
}: {
  role: Role;
  children: ReactNode;
  institutionCode?: string;
  branchCode?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to build correct relative paths
  const getHref = (href: string) => {
    if (href.startsWith("/app/suffat-hq") || href.startsWith("/settings")) return href;
    if (role === "STUDENT" || role === "PARENT") {
      return `/app/${institutionCode || "tenant"}/${branchCode || "branch"}/portal/${role.toLowerCase()}${href}`;
    }
    return `/app/${institutionCode || "tenant"}/${branchCode || "branch"}${href}`;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    // Also clear them locally just in case
    if ('serviceWorker' in navigator) { navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())); }
      document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = "__Host-Secure-Token=; Max-Age=0; path=/; Secure";
    window.location.href = "/login";
  };

  // Cmd+K Listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowSearch((open) => !open);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const renderSearchPalette = () => {
    if (!showSearch) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
        <div className="bg-zinc-900 border border-black/5 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col mx-4">
          <div className="flex items-center px-4 py-3 border-b border-black/5">
            <Search className="h-5 w-5 text-slate-500 mr-3" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search students, staff, invoices, or type a command..." 
              className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center space-x-1">
              <kbd className="bg-white/5 border border-black/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">ESC</kbd>
            </div>
            <button onClick={() => setShowSearch(false)} className="ml-3 p-1 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-2 max-h-[60vh] overflow-y-auto space-y-4">
            {/* Mock Results */}
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</div>
              <div className="px-3 py-2 hover:bg-blue-500/10 rounded-xl cursor-pointer flex items-center space-x-3 transition-colors text-slate-300 hover:text-blue-400">
                <User className="h-4 w-4" /> <span>Bilal Ahmed</span>
              </div>
              <div className="px-3 py-2 hover:bg-blue-500/10 rounded-xl cursor-pointer flex items-center space-x-3 transition-colors text-slate-300 hover:text-blue-400">
                <User className="h-4 w-4" /> <span>Bilal Khan</span>
              </div>
            </div>
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoices</div>
              <div className="px-3 py-2 hover:bg-emerald-500/10 rounded-xl cursor-pointer flex items-center space-x-3 transition-colors text-slate-300 hover:text-emerald-400">
                <FileText className="h-4 w-4" /> <span>INV-1023 <span className="text-slate-500 ml-2">₹4,500</span></span>
              </div>
            </div>
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Settings</div>
              <div onClick={() => { setShowSearch(false); router.push(getHref('/erp/settings')); }} className="px-3 py-2 hover:bg-indigo-500/10 rounded-xl cursor-pointer flex items-center space-x-3 transition-colors text-slate-300 hover:text-indigo-400">
                <Settings className="h-4 w-4" /> <span>Branch Settings</span>
              </div>
              <div onClick={() => { setShowSearch(false); router.push('/settings'); }} className="px-3 py-2 hover:bg-indigo-500/10 rounded-xl cursor-pointer flex items-center space-x-3 transition-colors text-slate-300 hover:text-indigo-400">
                <User className="h-4 w-4" /> <span>Personal Profile Settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationBell = () => (
    <div className="relative ml-4">
      <button 
        onClick={() => {
          if (role !== "STUDENT" && role !== "PARENT" && role !== "USTAD") {
            router.push(getHref('/erp/notifications'));
          } else {
            setShowNotifications(!showNotifications);
          }
        }}
        className="p-2 rounded-xl border border-black/5 bg-white/5 hover:bg-white/10 text-slate-300 relative"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full animate-pulse border-2 border-zinc-950"></span>
      </button>
      
      {showNotifications && (role === "STUDENT" || role === "PARENT" || role === "USTAD") && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-black/5 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-black/5 flex justify-between items-center bg-zinc-950/50">
            <span className="font-bold text-sm">Notifications</span>
            <button className="text-xs text-blue-400">Mark all read</button>
          </div>
          <div className="p-3 text-sm text-slate-400 text-center">
            You have 2 unread notifications.
          </div>
        </div>
      )}
    </div>
  );

  const renderSearchTrigger = () => (
    <button 
      onClick={() => setShowSearch(true)}
      className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-black/5 rounded-xl py-1.5 px-3 text-sm text-slate-400 transition-colors w-64 justify-between"
    >
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4" />
        <span>Search...</span>
      </div>
      <div className="flex items-center space-x-1">
        <kbd className="bg-white/5 border border-black/5 rounded px-1.5 py-0.5 text-[10px] font-mono">Ctrl</kbd>
        <kbd className="bg-white/5 border border-black/5 rounded px-1.5 py-0.5 text-[10px] font-mono">K</kbd>
      </div>
    </button>
  );

  if (role === "STUDENT" || role === "PARENT") {
    return (
      <div className="min-h-screen bg-[#F4F1ED] text-slate-800">
        {renderSearchPalette()}
        <header className="sticky top-0 z-40 border-b border-black/5 bg-[#184A45] shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <div className="font-bold flex items-center space-x-4">
              <span className="text-white">EPR Dashboard</span>
            </div>
            <nav className="flex gap-3 items-center">
              {renderSearchTrigger()}
              {PORTAL_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={getHref(item.href)}
                  className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                    pathname?.includes(item.href)
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                      : "border-black/5 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {renderNotificationBell()}
              <button 
                onClick={handleLogout}
                className="ml-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/20"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </div>
    );
  }

  if (role === "USTAD") {
    return (
      <div className="min-h-screen bg-[#F4F1ED] text-slate-800">
        {renderSearchPalette()}
        <header className="sticky top-0 z-40 border-b border-black/5 bg-[#184A45] shadow-sm flex items-center justify-between pr-4">
          <div className="flex items-center pl-4">
            {renderSearchTrigger()}
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 py-3 hide-scrollbar flex-1 justify-center">
            {USTAD_COMMAND_STRIP.map((item) => (
              <Link
                key={item.href}
                href={getHref(item.href)}
                className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm transition-colors ${
                  pathname?.includes(item.href)
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                    : "border-black/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {renderNotificationBell()}
            <button 
              onClick={handleLogout}
              className="whitespace-nowrap rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </div>
    );
  }

  // Admin/Junction/Nazim layout with sidebar
  const sidebar =
    role === "SUPER_ADMIN"
      ? SUPER_ADMIN_NAV
      : role === "CENTER_ADMIN"
      ? CENTER_ADMIN_NAV
      : role === "NAZIM"
      ? NAZIM_NAV
      : []; 

  return (
    <div className="flex min-h-screen bg-[#F4F1ED] text-slate-800">
      {renderSearchPalette()}
      <aside className="w-72 flex flex-col border-r border-black/5 bg-[#F9F6F0] p-4 shadow-sm">
        <div className="mb-6 text-lg font-bold">SuffatCore</div>
        <nav className="flex-1 space-y-2">
          {sidebar.map((item) => {
            const resolvedHref = getHref(item.href);
            return (
              <Link
                key={item.href}
                href={resolvedHref}
                className={`block rounded-xl border px-3 py-2 text-sm transition-colors ${
                  pathname === resolvedHref || (item.href !== "/erp" && pathname?.includes(item.href))
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                    : "border-black/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-black/5 pt-4 space-y-2">
          <button 
            onClick={() => router.push(role === "SUPER_ADMIN" ? "/app/suffat-hq/main/erp/settings" : getHref("/erp/settings"))}
            className="w-full text-left rounded-xl border border-black/5 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 flex items-center justify-between"
          >
            <span>Settings</span>
            <Settings className="h-4 w-4" />
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-16 border-b border-black/5 bg-zinc-950/50 shadow-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            {renderSearchTrigger()}
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => router.push('/settings')} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400">
              <User className="h-5 w-5" />
            </button>
            {renderNotificationBell()}
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
