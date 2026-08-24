import React from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            X
          </button>
        </div>

        <div>{children}</div>

        {footer && (
          <div className="mt-6 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
