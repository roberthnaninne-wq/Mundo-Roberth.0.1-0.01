import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Mundo Roberth.0.1 | Dashboard",
  description: "Teatro de visualização e monitoramento do Reino Digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="bg-[#0a0a0b] text-[#f0f0f1]">
        <Sidebar />
        <main className="pl-64 min-h-screen">
          <div className="container">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
