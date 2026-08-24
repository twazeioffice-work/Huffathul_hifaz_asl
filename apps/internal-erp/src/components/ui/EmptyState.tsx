import React from "react";

export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
      {icon && <div className="mb-4 text-zinc-500">{icon}</div>}
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-zinc-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
