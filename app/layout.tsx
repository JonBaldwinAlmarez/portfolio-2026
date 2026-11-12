import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import "./globals.css";
import { siteConfig } from "@/config/site";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Full-Stack Developer`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "A personal portfolio showcasing selected work and experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "dark min-h-full antialiased motion-safe:scroll-smooth", // <- "dark" added
        geistSans.variable,
        geistMono.variable,
        interHeading.variable,
      )}>
      <body className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main> {/* <- wrapped */}
      </body>
    </html>
  );
}
