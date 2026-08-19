"use client";

import { useState, useCallback } from "react";

export type InspectorType =
  | "student_admission"
  | "affiliation_request"
  | "report_audit"
  | "asset_registration";

export interface InspectorState {
  isOpen: boolean;
  itemId: string | null;
  type: InspectorType | null;
}

export function useApprovalInspector() {
  const [state, setState] = useState<InspectorState>({
    isOpen: false,
    itemId: null,
    type: null,
  });

  const inspect = useCallback((id: string, type: InspectorType) => {
    setState({
      isOpen: true,
      itemId: id,
      type,
    });
  }, []);

  const closeInspector = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return {
    isInspectorOpen: state.isOpen,
    inspectedId: state.itemId,
    inspectorType: state.type,
    inspect,
    closeInspector,
  };
}
