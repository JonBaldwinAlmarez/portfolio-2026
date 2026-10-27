"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      className="mx-auto flex min-h-[65vh] w-full max-w-5xl scroll-mt-20 flex-col items-start justify-center px-6 py-20"
      id="home">
      <p className="text-sm font-medium text-primary">Personal Portfolio</p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-4 max-w-3xl font-heading text-5xl font-semibold tracking-tight sm:text-7xl">
        Hi, I’m {siteConfig.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        I’m Jon Almarez, a freelance software developer specializing in HTML,
        CSS, JavaScript, React, React Native, Tailwind CSS, and Lavavel. I
        prioritize clean code, performance, and user-friendly design.
      </motion.p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button>
          <Link href="/#projects">View projects</Link>
        </Button>

        <a
          href="/CV/Curriculum-Vitae.pdf"
          download="Curriculum-Vitae.pdf"
          rel="noopener noreferrer">
          <Button>Download CV</Button>
        </a>
      </div>
    </section>
  );
}
