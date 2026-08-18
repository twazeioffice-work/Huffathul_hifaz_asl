"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ExportProgressToastProps {
  taskId: string | null;
  onComplete?: (fileUrl: string) => void;
}

export default function ExportProgressToast({ taskId, onComplete }: ExportProgressToastProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;
    setStatus("running");
    setProgress(0);

    // Simulate progress polling (in production, poll /api/v1/reports/tasks/{taskId})
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("completed");
          const mockUrl = `/api/v1/reports/download/${taskId}`;
          setFileUrl(mockUrl);
          onComplete?.(mockUrl);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [taskId, onComplete]);

  if (!taskId || status === "idle") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 glass-panel border border-border rounded-lg p-4 shadow-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status === "running" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
          {status === "completed" && <CheckCircle className="w-4 h-4 text-green-400" />}
          {status === "failed" && <AlertCircle className="w-4 h-4 text-red-400" />}
          <span className="text-xs font-bold text-white">
            {status === "running" && "Generating Export..."}
            {status === "completed" && "Export Ready"}
            {status === "failed" && "Export Failed"}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          {Math.min(progress, 100)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: status === "failed" ? "#EF4444" : "#00F0FF",
          }}
        />
      </div>

      {/* Download button */}
      {status === "completed" && fileUrl && (
        <button
          onClick={() => window.open(fileUrl, "_blank")}
          className="w-full flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold py-2 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download File
        </button>
      )}
    </div>
  );
}
