import type { Metadata } from "next";
import "@/styles/globals.css";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

export const metadata: Metadata = {
  title: "Suffat-ul Huffaz | Premier Quranic Memorization & Islamic Scholarship",
  description:
    "Standardizing excellence in classical Quranic memorization, rigorous Tajweed, and contemporary Islamic scholarship across national branches with digital mastery.",
  keywords: [
    "Hifz",
    "Quran Memorization",
    "Tajweed",
    "Islamic Scholarship",
    "Suffat-ul Huffaz",
    "Islamic Education ERP",
  ],
  authors: [{ name: "Suffat-ul Huffaz Academic Directorate" }],
  openGraph: {
    title: "Suffat-ul Huffaz Digital Educational Network",
    description:
      "Classical Quranic memorization meets modern educational standardisation.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between">
        <div>
          <PublicNavbar />
          <main>{children}</main>
        </div>
        <PublicFooter />
      </body>
    </html>
  );
}
