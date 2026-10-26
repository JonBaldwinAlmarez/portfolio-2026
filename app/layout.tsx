import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
import "./globals.css";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Name | Portfolio",
  description: "A personal portfolio showcasing selected work and experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "min-h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        interHeading.variable,
      )}
    >
      <body className="flex min-h-screen flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
