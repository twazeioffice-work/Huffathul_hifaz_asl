import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  let baseStyle = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ";

  if (variant === "success") {
    baseStyle += "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (variant === "warning") {
    baseStyle += "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (variant === "danger") {
    baseStyle += "bg-red-500/10 text-red-400 border-red-500/20";
  } else if (variant === "info") {
    baseStyle += "bg-sky-500/10 text-sky-400 border-sky-500/20";
  } else {
    baseStyle += "bg-zinc-500/10 text-zinc-300 border-zinc-500/20";
  }

  return (
    <span className={baseStyle + " " + className}>
      {children}
    </span>
  );
}
