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
      className={`w-full rounded-2xl border border-[#E2D8C9] bg-gradient-to-br from-white to-[#F9F6F0] p-6 text-left shadow-sm transition-all ${
        onClick ? "hover:border-teal-600/30 hover:shadow-md active:scale-95" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-slate-500">
          {title}
        </span>
        {icon && <div className="text-slate-500">{icon}</div>}
      </div>

      <div className="mt-4 text-3xl font-bold text-slate-800">
        {value}
      </div>

      {trend && (
        <div className="mt-2 text-xs text-slate-500">
          {trend}
        </div>
      )}
    </Component>
  );
}
