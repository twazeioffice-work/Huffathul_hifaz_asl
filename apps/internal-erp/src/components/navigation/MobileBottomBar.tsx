"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, MessageSquare } from "lucide-react";

interface MobileBottomBarProps {
  institutionCode: string;
  branchCode: string;
}

export function MobileBottomBar({ institutionCode, branchCode }: MobileBottomBarProps) {
  const pathname = usePathname();
  const basePath = `/app/${institutionCode}/${branchCode}/erp`;

  const tabs = [
    { name: "Home", href: `${basePath}`, icon: Home },
    { name: "Academics", href: `${basePath}/academics`, icon: BookOpen },
    { name: "My Students", href: `${basePath}/students`, icon: Users },
    { name: "Complaints", href: `${basePath}/community`, icon: MessageSquare }, // mapping complaints to community or complaints route
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0A0A0C]/90 backdrop-blur-xl border-t border-white/[0.08] pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = tab.href === basePath 
            ? pathname === basePath || pathname === basePath + "/"
            : pathname.startsWith(tab.href);

          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium tracking-tight ${isActive ? "font-bold" : ""}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
