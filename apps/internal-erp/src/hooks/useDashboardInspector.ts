import { useState } from 'react';

export type MetricInspectorType = 'PORTFOLIO_VALUE' | 'TRANSPORT_FLEET' | 'DORMITORY_CAPACITY' | 'PHYSICAL_ASSETS' | 'MESH_INFRASTRUCTURE' | null;

export interface InspectorState {
  isOpen: boolean;
  activeType: MetricInspectorType;
  entityId: string | null;
  branchContext: string | null;
}

export function useDashboardInspector() {
  const [state, setState] = useState<InspectorState>({
    isOpen: false,
    activeType: null,
    entityId: null,
    branchContext: null,
  });

  const openInspector = (type: MetricInspectorType, entityId: string | null = null, branch: string | null = null) => {
    setState({
      isOpen: true,
      activeType: type,
      entityId,
      branchContext: branch,
    });
  };

  const closeInspector = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return {
    isOpen: state.isOpen,
    activeType: state.activeType,
    entityId: state.entityId,
    branchContext: state.branchContext,
    openInspector,
    closeInspector,
  };
}
