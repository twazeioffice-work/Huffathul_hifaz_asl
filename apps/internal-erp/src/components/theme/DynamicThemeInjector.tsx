// Location: apps/internal-erp/src/components/theme/DynamicThemeInjector.tsx
import React from 'react';

interface ThemeConfig {
  primary_color: string;
  background_color: string;
  text_color: string;
}

async function fetchTenantBranding(institutionCode: string, branchCode: string): Promise<ThemeConfig> {
  // Try dynamic API route, fallback gracefully
  try {
    const res = await fetch(`http://localhost:8000/api/v1/app/${institutionCode}/${branchCode}/branding/theme`, {
      next: { revalidate: 3600 } // Cache theme context for 1 hour
    });
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return await res.json();
  } catch (error) {
    return {
      primary_color: "#00F0FF", // default Neon Cyan
      background_color: "#0A0F1D", // default Deep Midnight
      text_color: "#F8FAFC" // default Slate foreground
    };
  }
}

export default async function DynamicThemeInjector({
  institutionCode,
  branchCode
}: {
  institutionCode: string;
  branchCode: string;
}) {
  const theme = await fetchTenantBranding(institutionCode, branchCode);

  // Compile inline stylesheet to override CSS custom properties globally at runtime
  const dynamicStyles = `
    :root {
      --background-dynamic: ${theme.background_color};
      --foreground-dynamic: ${theme.text_color};
      --primary-dynamic: ${theme.primary_color};
    }
    
    body {
      background-color: var(--background-dynamic) !important;
      color: var(--foreground-dynamic) !important;
    }
    
    .dynamic-accent-bg {
      background-color: var(--primary-dynamic) !important;
    }
    
    .dynamic-accent-border {
      border-color: var(--primary-dynamic) !important;
    }
  `;

  return (
    <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
  );
}
