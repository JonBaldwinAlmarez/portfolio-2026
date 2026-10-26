"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-5xl flex-col items-start justify-center px-6 py-20">
      <p className="text-sm font-medium text-primary">Personal portfolio</p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-4 max-w-3xl font-heading text-5xl font-semibold tracking-tight sm:text-7xl"
      >
        Hi, I’m {siteConfig.name}.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
      >
        Replace this sentence with a short introduction about what you do and
        the kind of work you enjoy.
      </motion.p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          href="/projects"
        >
          View projects
        </Link>
        <Link
          className="rounded-md border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
          href="/contact"
        >
          Get in touch
        </Link>
      </div>
    </section>
  );
}
