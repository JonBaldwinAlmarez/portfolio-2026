import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
import "./globals.css";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // "template" adds your name after every page title:
  // the home page shows "Your Name | Frontend Developer",
  // and other pages show "Projects | Your Name"
  title: {
    default: "Your Name | Frontend Developer",
    template: "%s | Your Name",
  },
  description: "A personal portfolio showcasing selected work and experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "dark min-h-full antialiased", // <- "dark" added
        geistSans.variable,
        geistMono.variable,
        interHeading.variable,
      )}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main> {/* <- wrapped */}
        <Footer />
      </body>
    </html>
  );
}
