"use client";

import { useState, useEffect, useCallback } from "react";

interface ExportTaskState {
  taskId: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  fileUrl: string | null;
  error: string | null;
}

export function useExportTracker(taskId: string | null, pollIntervalMs: number = 2000) {
  const [state, setState] = useState<ExportTaskState>({
    taskId: taskId || "",
    status: "pending",
    progress: 0,
    fileUrl: null,
    error: null,
  });

  const pollStatus = useCallback(async () => {
    if (!taskId) return;
    try {
      const res = await fetch(`/api/proxy/reports/tasks/${taskId}`);
      if (!res.ok) throw new Error("Failed to fetch task status");

      const data = await res.json();
      setState({
        taskId,
        status: data.status,
        progress: data.progress,
        fileUrl: data.file_url || null,
        error: data.error_message || null,
      });
    } catch (err) {
      setState((prev) => ({ ...prev, error: "Polling failed" }));
    }
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    setState({ taskId, status: "pending", progress: 0, fileUrl: null, error: null });
    const interval = setInterval(() => {
      pollStatus();
    }, pollIntervalMs);

    // Initial poll
    pollStatus();

    return () => clearInterval(interval);
  }, [taskId, pollIntervalMs, pollStatus]);

  // Stop polling once terminal state reached
  useEffect(() => {
    if (state.status === "completed" || state.status === "failed") {
      // no-op: interval cleared by cleanup
    }
  }, [state.status]);

  return state;
}
