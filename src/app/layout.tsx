import type { Metadata } from "next";
import "./globals.css";

import Navbar from '@/components/ui/navbar';
import Header from '@/components/Header';

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
      <Header/>
      <Navbar />
        {children}
      </body>
    </html>
  );
}
