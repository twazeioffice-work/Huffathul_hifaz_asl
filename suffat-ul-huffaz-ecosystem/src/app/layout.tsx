import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'Suffat-ul Huffaz Command Center',
  description: 'Enterprise Multi-Tenant Digital LMS & ERP Platform',
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
