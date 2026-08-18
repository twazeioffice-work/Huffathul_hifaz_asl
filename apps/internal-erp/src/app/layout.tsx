import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Suffat-ul Huffaz | ERP & LMS",
  description: "Unified Digital Ecosystem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
