import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  let baseStyle = "rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ";

  if (variant === "primary") {
    baseStyle += "bg-cyan-500 text-zinc-950 hover:bg-cyan-400";
  } else if (variant === "secondary") {
    baseStyle += "bg-white/5 border border-white/10 text-white hover:bg-white/10";
  } else if (variant === "danger") {
    baseStyle += "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20";
  } else if (variant === "ghost") {
    baseStyle += "bg-transparent text-zinc-300 hover:bg-white/5";
  }

  return (
    <button className={baseStyle + " " + className} {...props}>
      {children}
    </button>
  );
}
