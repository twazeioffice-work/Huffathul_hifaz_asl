import React from 'react';

/**
 * Injects CSS custom properties dynamically at the root layout 
 * based on the Tenant's Database Branding payload.
 */
export const DynamicThemeInjector: React.FC<{ primaryColor: string, logoUrl: string }> = ({ primaryColor, logoUrl }) => {
  const styles = `
    :root {
      --tenant-primary: ${primaryColor};
    }
  `;

  return (
    <style dangerouslySetInnerHTML={{ __html: styles }} />
  );
};
