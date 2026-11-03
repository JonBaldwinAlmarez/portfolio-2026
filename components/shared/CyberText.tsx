"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const GLYPHS = "01<>/\\{}[]#$%&*+=_ｱｲｳｴｵｶｷｸｹｺ";
const WINDOW = 14; // how many characters ahead of the decode front show glitch glyphs
const TICK_MS = 40;

function randomGlyphs(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

/**
 * CyberText
 * Decodes text left to right: a wave of cyan code glyphs runs ahead of the
 * real characters, and a thin scan line sweeps down the block as it resolves.
 *
 * Layout never jumps: every word reserves its final width (invisible copy)
 * and the glyphs are drawn on top of it. Screen readers get the real text.
 */
export function CyberText({
  text,
  className,
  delay = 0.6,
  duration = 1.8,
  active = true,
}: {
  text: string;
  className?: string;
  /** Seconds to wait before decoding starts */
  delay?: number;
  /** Seconds the decode takes */
  duration?: number;
  /** Decoding starts when this becomes true (e.g. when scrolled into view) */
  active?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [frame, setFrame] = useState<{
    revealed: number;
    glyphs: string;
  } | null>(null);

  const words = useMemo(() => {
    const parts = text.split(" ");
    return parts.map((word, i) => ({
      word,
      // Characters before this word, plus one space after each earlier word
      start: parts.slice(0, i).reduce((sum, w) => sum + w.length + 1, 0),
    }));
  }, [text]);

  useEffect(() => {
    if (reduceMotion || !active) return;

    const total = text.length;
    const step = Math.max(1, Math.ceil(total / ((duration * 1000) / TICK_MS)));
    let revealed = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        revealed = Math.min(total, revealed + step);
        setFrame({ revealed, glyphs: randomGlyphs(total) });
        if (revealed >= total && interval) clearInterval(interval);
      }, TICK_MS);
    }, delay * 1000);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, duration, reduceMotion, active]);

  if (reduceMotion) return <span className={className}>{text}</span>;

  return (
    <span className={`relative block ${className ?? ""}`}>
      <span className="sr-only">{text}</span>

      <span aria-hidden>
        {words.map(({ word, start }, wi) => (
          <Fragment key={wi}>
            {wi > 0 && " "}
            <span className="relative inline-block">
              {/* Reserves the word's final width */}
              <span className="invisible">{word}</span>
              <span className="absolute left-0 top-0 whitespace-nowrap">
                {word.split("").map((char, ci) => {
                  if (!frame) return null;
                  const i = start + ci;
                  if (i < frame.revealed) return char;
                  if (i < frame.revealed + WINDOW) {
                    return (
                      <span key={ci} className="text-primary">
                        {frame.glyphs[i]}
                      </span>
                    );
                  }
                  return null;
                })}
              </span>
            </span>
          </Fragment>
        ))}
      </span>

      {/* Lens-flare scan: glowing core with a long horizontal streak that fades at both ends */}
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
    </span>
  );
}
