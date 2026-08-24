import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, error, required, className = "", ...props }: InputProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 block text-xs text-zinc-400">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        className={`w-full rounded-xl border bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-500/20 ${
          error ? "border-red-500/50" : "border-white/10"
        }`}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-red-400">{error}</span>}
    </div>
  );
}
