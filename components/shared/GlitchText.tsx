"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * GlitchText
 * Wraps text in a periodic glitch: two colored copies (cyan and red, from your
 * theme) flash in as horizontal slices that jump sideways, while the main text
 * jitters. Bursts repeat every few seconds and fire right away on hover.
 * Built with Motion only, so it needs no CSS changes.
 */
export function GlitchText({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  if (reduceMotion) return <>{children}</>;

  const transition = {
    duration: 0.55,
    ease: "linear" as const,
    repeat: Infinity,
    repeatDelay: hovered ? 0.2 : 3.2,
    delay: 0.8, // first burst lands just after the heading finishes fading in
  };

  return (
    <span
      // Remounting on hover restarts the burst immediately
      key={hovered ? "hover" : "idle"}
      className="relative block"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}>
      {/* Main text */}
      <motion.span
        className="block"
        animate={{
          x: [0, 3, -3, 1, -1, 3, 0],
          skewX: [0, -3, 2, 0, -2, 1, 0],
        }}
        transition={transition}>
        {children}
      </motion.span>

      {/* Cyan slice layer */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 block text-primary mix-blend-screen"
        initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={{
          opacity: [0, 1, 1, 1, 1, 1, 0],
          x: [0, -7, 4, -4, 7, -2, 0],
          clipPath: [
            "inset(0% 0 100% 0)",
            "inset(10% 0 70% 0)",
            "inset(55% 0 20% 0)",
            "inset(30% 0 45% 0)",
            "inset(75% 0 5% 0)",
            "inset(0% 0 85% 0)",
            "inset(0% 0 100% 0)",
          ],
        }}
        transition={transition}>
        {children}
      </motion.span>

      {/* Red slice layer */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 block text-destructive mix-blend-screen"
        initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
        animate={{
          opacity: [0, 1, 1, 1, 1, 1, 0],
          x: [0, 6, -5, 3, -7, 2, 0],
          clipPath: [
            "inset(100% 0 0% 0)",
            "inset(60% 0 15% 0)",
            "inset(15% 0 65% 0)",
            "inset(45% 0 35% 0)",
            "inset(5% 0 80% 0)",
            "inset(80% 0 0% 0)",
            "inset(100% 0 0% 0)",
          ],
        }}
        transition={transition}>
        {children}
      </motion.span>
    </span>
  );
}
