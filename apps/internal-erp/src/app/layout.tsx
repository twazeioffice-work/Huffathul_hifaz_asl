import React from 'react';
export const dynamic = 'force-dynamic';
import '../styles/globals.css';

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Suffat-ul Huffaz Digital ERP",
  description: "Enterprise-Grade Multi-Tenant ERP",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Suffat ERP",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050506] text-slate-100 font-sans antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
