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
import { Bell, Search, User, Settings, X } from "lucide-react";

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
      return `/app/${institutionCode || "suffat"}/${branchCode || "main"}/portal/${role.toLowerCase()}${href}`;
    }
    return `/app/${institutionCode || "suffat"}/${branchCode || "main"}${href}`;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    if ('serviceWorker' in navigator) { 
      navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())); 
    }
    document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = "__Host-Secure-Token=; Max-Age=0; path=/; Secure";
    window.location.href = "/login";
  };

  // Cmd+K Listener
  useEffect(() => {
    if (role !== "SUPER_ADMIN") return;
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
  }, [role]);

  const renderSearchPalette = () => {
    if (!showSearch || role !== "SUPER_ADMIN") return null;
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
        <div className="bg-white border border-black/5 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col mx-4">
          <div className="flex items-center px-4 py-3 border-b border-black/5">
            <Search className="h-5 w-5 text-slate-500 mr-3" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search center names, usthad name, student name, finance..." 
              className="flex-1 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center space-x-1">
              <kbd className="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">ESC</kbd>
            </div>
            <button onClick={() => setShowSearch(false)} className="ml-3 p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationBell = () => (
    <div className="relative">
      <button 
        onClick={() => {
          if (role !== "STUDENT" && role !== "PARENT" && role !== "USTAD") {
            router.push(getHref('/erp/notifications'));
          } else {
            setShowNotifications(!showNotifications);
          }
        }}
        className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-colors relative"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-rose-500 rounded-full animate-pulse"></span>
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-slate-800">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-[#184A45] text-white">
            <span className="font-bold text-xs">Notifications</span>
            <button onClick={() => setShowNotifications(false)} className="text-xs text-cyan-300">Close</button>
          </div>
          <div className="p-4 text-xs text-slate-600 text-center">
            All systems verified and operational.
          </div>
        </div>
      )}
    </div>
  );

  const renderSearchTrigger = () => {
    if (role !== "SUPER_ADMIN") return null;
    return (
      <button 
        onClick={() => setShowSearch(true)}
        className="flex items-center space-x-2 bg-white text-slate-800 hover:text-slate-900 border border-black/5 rounded-xl py-1.5 px-3 text-sm transition-colors w-[26rem] justify-start shadow-sm"
      >
        <Search className="h-4 w-4 text-slate-500" />
        <span className="text-slate-500 truncate text-xs">Search center names, usthad name, student name, finance...</span>
      </button>
    );
  };

  const renderUserProfileButton = () => (
    <button 
      onClick={() => router.push('/settings')} 
      className="flex items-center space-x-2 p-1.5 pr-3 hover:bg-white/10 rounded-xl transition-colors text-slate-100 border border-white/10 bg-white/5"
      title="View Profile & Settings"
    >
      <div className="h-6 w-6 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold text-xs font-mono">
        <User className="h-3.5 w-3.5" />
      </div>
      <span className="text-xs font-medium text-slate-200 hidden sm:inline">Profile</span>
    </button>
  );

  if (role === "STUDENT" || role === "PARENT") {
    return (
      <div className="min-h-screen bg-[#F4F1ED] text-slate-800">
        {renderSearchPalette()}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#184A45] shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href={`/app/${institutionCode || "suffat"}/${branchCode || "main"}/portal/${role.toLowerCase()}`} className="font-bold flex items-center space-x-2">
              <span className="text-white font-bold text-base tracking-tight">Suffat {role === 'STUDENT' ? 'Student' : 'Parent'} Portal</span>
            </Link>
            <nav className="flex gap-2 items-center">
              {PORTAL_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={getHref(item.href)}
                  className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                    pathname?.includes(item.href)
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 font-semibold"
                      : "border-transparent bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {renderNotificationBell()}
              {renderUserProfileButton()}
              <button 
                onClick={handleLogout}
                className="ml-2 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </div>
    );
  }

  if (role === "USTAD") {
    return (
      <div className="min-h-screen bg-[#F4F1ED] text-slate-800">
        {renderSearchPalette()}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#184A45] shadow-sm flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-white text-sm hidden md:inline">Ustad Console</span>
          </div>
          <div className="flex gap-2 overflow-x-auto px-2 hide-scrollbar flex-1 justify-center">
            {USTAD_COMMAND_STRIP.map((item) => (
              <Link
                key={item.href}
                href={getHref(item.href)}
                className={`whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                  pathname === getHref(item.href) || (item.href !== "/erp/academics" && pathname?.includes(item.href))
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 font-semibold"
                    : "border-transparent bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {renderUserProfileButton()}
            {renderNotificationBell()}
            <button 
              onClick={handleLogout}
              className="whitespace-nowrap rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20"
            >
              Sign Out
            </button>
          </div>
        </header>
        <main className="p-6">{children}</main>
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
      <aside className="w-72 flex flex-col border-r border-white/10 bg-[#184A45] text-slate-100 p-4 shadow-sm">
        <div className="mb-6 text-lg font-bold">SuffatCore</div>
        <nav className="flex-1 space-y-1.5">
          {sidebar.map((item) => {
            const resolvedHref = getHref(item.href);
            const isActive = pathname === resolvedHref || (item.href !== "/erp" && item.href !== "/app/suffat-hq/main/erp" && pathname?.includes(item.href));
            return (
              <Link
                key={item.href}
                href={resolvedHref}
                className={`block rounded-xl border px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 font-semibold"
                    : "border-transparent bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4 space-y-2">
          <button 
            onClick={() => router.push('/settings')}
            className="w-full text-left rounded-xl border border-transparent bg-transparent hover:bg-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white flex items-center justify-between"
          >
            <span>Settings</span>
            <Settings className="h-4 w-4" />
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300 hover:bg-red-400/20"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-16 border-b border-black/5 bg-[#184A45] shadow-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            {renderSearchTrigger()}
          </div>
          <div className="flex items-center space-x-3">
            {renderUserProfileButton()}
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
