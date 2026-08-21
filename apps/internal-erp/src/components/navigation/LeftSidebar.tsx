"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Briefcase, 
  CreditCard, 
  BookOpen, 
  Truck, 
  MessageSquare, 
  BarChart3 
} from "lucide-react";

interface LeftSidebarProps {
  institutionCode: string;
  branchCode: string;
  userRole: "SUPER_ADMIN" | "NAZIM" | "USTAD";
}

export function LeftSidebar({ institutionCode, branchCode, userRole }: LeftSidebarProps) {
  const pathname = usePathname();
  const basePath = `/app/${institutionCode}/${branchCode}/erp`;

  const navLinks = [
    { name: "Command Center", href: `${basePath}`, icon: LayoutDashboard, roles: ["SUPER_ADMIN", "NAZIM", "USTAD"] },
    { name: "Students", href: `${basePath}/students`, icon: Users, roles: ["SUPER_ADMIN", "NAZIM", "USTAD"] },
    { name: "Academics", href: `${basePath}/academics`, icon: GraduationCap, roles: ["SUPER_ADMIN", "NAZIM", "USTAD"] },
    { name: "Staff", href: `${basePath}/staff`, icon: Briefcase, roles: ["SUPER_ADMIN", "NAZIM"] },
    { name: "Billing", href: `${basePath}/billing`, icon: CreditCard, roles: ["SUPER_ADMIN", "NAZIM"] },
    { name: "Ledger", href: `${basePath}/ledger`, icon: BookOpen, roles: ["SUPER_ADMIN", "NAZIM"] },
    { name: "Assets & Fleet", href: `${basePath}/assets`, icon: Truck, roles: ["SUPER_ADMIN"] },
    { name: "Communication", href: `${basePath}/communication`, icon: MessageSquare, roles: ["SUPER_ADMIN", "NAZIM"] },
    { name: "Reports", href: `${basePath}/reports`, icon: BarChart3, roles: ["SUPER_ADMIN", "NAZIM"] },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-[#050506] h-[calc(100vh-56px)] shrink-0 z-30">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
        {navLinks.map((link) => {
          if (!link.roles.includes(userRole)) return null;
          
          const isActive = link.href === basePath
            ? pathname === basePath || pathname === basePath + "/"
            : pathname.startsWith(link.href);
            
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-white border border-transparent"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-sm font-semibold tracking-tight">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
