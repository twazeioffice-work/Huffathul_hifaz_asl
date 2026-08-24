import React from "react";

export function KpiCard({
  title,
  value,
  trend,
  icon,
  onClick
}: {
  title: string;
  value: React.ReactNode;
  trend?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      className={`w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl transition-all ${
        onClick ? "hover:border-cyan-400/20 active:scale-95" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-zinc-400">
          {title}
        </span>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>

      <div className="mt-4 text-3xl font-bold text-white">
        {value}
      </div>

      {trend && (
        <div className="mt-2 text-xs text-zinc-400">
          {trend}
        </div>
      )}
    </Component>
  );
}
