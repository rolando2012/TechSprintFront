import type { Metadata } from "next";
import "./globals.css";

// import Navbar from '@/components/ui/navbar_tutor';
import Footer from '@/components/ui/footer';  // 👈 Importas el Footer también

export const metadata: Metadata = {
  title: "TechSprint",
  description: "Página para inscripción de olimpiadas científicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* <Navbar /> */}
        <main className="flex-grow">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
