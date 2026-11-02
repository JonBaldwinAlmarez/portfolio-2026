"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { GlitchText } from "@/components/shared/GlitchText";
import { CyberText } from "@/components/shared/CyberText";

const INTRO =
  "A freelance software developer specializing in HTML, CSS, JavaScript, React, React Native, Tailwind CSS, and Laravel. I prioritize clean code, performance, security, and modern design.";

// Three.js only runs in the browser, so skip server rendering for the scene.
const ReactLogoScene = dynamic(
  () => import("@/components/shared/ReactLogoScene"),
  { ssr: false },
);

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[65vh] w-full scroll-mt-20 overflow-hidden">
      {/* 3D background: sits behind the content and receives drags */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <ReactLogoScene />
        {/* Fades the scene into the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Content ignores the pointer except where it needs it, so empty areas
          pass drags through to the 3D scene.
          Below lg the logo sits in the empty band above the text (pt-[21rem]);
          from lg up it sits beside the text. Keep pt-[21rem] in sync with
          LOGO_CENTER_Y_STACKED in ReactLogoScene. */}
      <div className="pointer-events-none mx-auto flex w-full max-w-5xl flex-col items-start justify-center px-6 pb-16 pt-[15rem] sm:pb-20 lg:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-auto mt-4 max-w-3xl font-heading text-5xl font-semibold tracking-tight sm:text-7xl">
          <GlitchText>Hi, I’m {siteConfig.name}</GlitchText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="pointer-events-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          <CyberText text={INTRO} />
        </motion.p>

        <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
          {/* View Projects */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <AnimatedButton href="/#projects">View projects</AnimatedButton>
          </motion.div>

          {/* Download CV */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <AnimatedButton
              href="/CV/Curriculum-Vitae.pdf"
              download="Curriculum-Vitae.pdf"
              direction="counterclockwise">
              Download CV
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
