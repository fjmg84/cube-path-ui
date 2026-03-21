import type { Metadata } from "next";
import { SidebarNav } from "@/components/sidebar-nav";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CubePath Dashboard",
  description: "Panel para gestionar API key, VPS y metricas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
        <div className="flex min-h-full flex-col md:flex-row">
          <SidebarNav />
          <main className="flex min-h-full flex-1 p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
