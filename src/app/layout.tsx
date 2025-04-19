import type { Metadata } from "next";
import "./globals.css";


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
        {children}
      </body>
    </html>
  );
}
