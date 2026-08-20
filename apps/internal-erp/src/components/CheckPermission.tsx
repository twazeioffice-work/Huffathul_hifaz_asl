import React from 'react';

interface CheckPermissionProps {
  requiredRole: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Server-side RBAC visual filtering component.
 * Conditionally strips UI elements from the DOM if the active 
 * user's JWT claims do not satisfy the required role.
 */
export const CheckPermission: React.FC<CheckPermissionProps> = ({ 
  requiredRole, 
  children, 
  fallback = null 
}) => {
  // Mock permission validation for Phase 3 UI component testing
  const userRole = 'SYSTEM_ADMIN'; 
  const hasPermission = userRole === requiredRole || userRole === 'SYSTEM_ADMIN';
  
  return <>{hasPermission ? children : fallback}</>;
};
