import type { Metadata } from "next";
import "./globals.css";

import Navbar from '@/components/ui/navbar';

export const metadata: Metadata = {
  title: "TechSprint",
  description: "Pagina para inscripcion de olimpiadas cientificas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
      <Navbar />
        {children}
      </body>
    </html>
  );
}
