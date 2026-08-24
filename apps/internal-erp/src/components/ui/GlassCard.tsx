import React from "react";

export function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/5 " +
        "backdrop-blur-xl shadow-xl p-6 " +
        className
      }
    >
      {children}
    </div>
  );
}
