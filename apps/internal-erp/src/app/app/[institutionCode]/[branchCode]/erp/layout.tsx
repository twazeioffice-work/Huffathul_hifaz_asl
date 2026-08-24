import { ReactNode } from "react";

export default function ERPWorkspaceLayout({ children }: { children: ReactNode }) {
  // Layout shell is now handled at the tenant level by AppShell
  return <>{children}</>;
}
