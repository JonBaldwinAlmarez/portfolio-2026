"use client";

import { motion } from "motion/react";

/**
 * LensFlareScan
 * A glowing line that sweeps from the top to the bottom of its parent.
 * The parent must have `relative` so the flare stays inside it.
 */
export function LensFlareScan({
  active = true,
  delay = 0,
  duration = 1.8,
}: {
  /** The sweep starts when this becomes true */
  active?: boolean;
  /** Seconds to wait before sweeping */
  delay?: number;
  /** Seconds the sweep takes */
  duration?: number;
}) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 h-0"
      initial={{ opacity: 0, top: "0%" }}
      animate={
        active
          ? { opacity: [0, 1, 1, 0], top: ["0%", "100%"] }
          : { opacity: 0, top: "0%" }
      }
      transition={{
        opacity: {
          duration,
          delay,
          ease: "linear",
          times: [0, 0.1, 0.65, 1],
        },
        top: { duration, delay, ease: "linear" },
      }}>
      {/* Wide soft glow */}
      <span className="absolute left-1/2 top-0 h-24 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl" />
      {/* Streak: blurred layer gives it thickness */}
      <span className="absolute -inset-x-4 top-0 h-1.5 -translate-y-1/2 bg-linear-to-r from-transparent via-primary to-transparent blur-[3px]" />
      {/* Streak: sharp center line */}
      <span className="absolute -inset-x-4 top-0 h-0.5 -translate-y-1/2 bg-linear-to-r from-transparent via-primary to-transparent" />
      {/* Bright bar around the core */}
      <span className="absolute left-1/2 top-0 h-1 w-28 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-transparent via-white to-transparent blur-[1px]" />
      {/* Core */}
      <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_6px_var(--primary)]" />
    </motion.span>
  );
}
