import React from "react";

export function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-[#E2D8C9] bg-gradient-to-br from-white to-[#F9F6F0] " +
        "shadow-sm text-slate-800 p-6 " +
        className
      }
    >
      {children}
    </div>
  );
}
