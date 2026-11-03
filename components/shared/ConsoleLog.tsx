"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { CyberText } from "@/components/shared/CyberText";
import { cn } from "@/lib/utils";

/**
 * Spaceship console-log building blocks.
 * Every piece waits until it scrolls into view, then plays once.
 *  - LogEntry:      one log line (mission time + level tag + decoding text)
 *  - LogHeading:    a heading that decodes in
 *  - ConsolePrompt: a shell prompt with a blinking cursor
 *  - LogModule:     a "$ mount ... [ OK ]" bar, then the content loads in
 */

const LEVELS = {
  SYS: "text-muted-foreground",
  NAV: "text-chart-3",
  OK: "text-primary",
  INFO: "text-primary",
  STACK: "text-chart-2",
  GOAL: "text-chart-3",
} as const;

export type LogLevel = keyof typeof LEVELS;

const SIZES = {
  // Short system lines
  sm: {
    text: "font-mono text-sm leading-6 text-muted-foreground",
    gutter: "sm:pt-1",
  },
  // Paragraphs
  lg: { text: "text-lg leading-8 text-muted-foreground", gutter: "sm:pt-2" },
} as const;

// Starts a little before the element is fully on screen.
const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

export function LogEntry({
  time,
  level,
  text,
  size = "lg",
  delay = 0,
  duration = 1.4,
  className,
}: {
  /** Mission time shown in the gutter, e.g. "T+00:04" */
  time: string;
  level: LogLevel;
  text: string;
  size?: keyof typeof SIZES;
  /** Seconds to wait after scrolling into view */
  delay?: number;
  /** Seconds the text takes to decode */
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEW);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col gap-1 sm:flex-row sm:gap-5">
      {/* Gutter: mission time and level tag */}
      <div
        aria-hidden
        className={cn(
          "flex shrink-0 items-center gap-2 font-mono text-xs sm:w-40",
          SIZES[size].gutter,
        )}>
        <span className="text-muted-foreground/70">[{time}]</span>
        <span className={cn("font-semibold", LEVELS[level])}>{level}</span>
      </div>

      <CyberText
        text={text}
        active={inView}
        delay={delay + 0.2}
        duration={duration}
        className={cn("min-w-0 flex-1", SIZES[size].text, className)}
      />
    </motion.div>
  );
}

export function LogHeading({
  id,
  text,
  className,
}: {
  id?: string;
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, VIEW);

  return (
    <h2 ref={ref} id={id} className={className}>
      <CyberText text={text} active={inView} delay={0.1} duration={1} />
    </h2>
  );
}

export function ConsolePrompt({ command }: { command: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEW);

  return (
    <div
      ref={ref}
      aria-hidden
      className="mt-10 flex flex-wrap items-center gap-x-2 font-mono text-sm">
      <span className="text-primary">crew@ship:~$</span>
      <CyberText
        text={command}
        active={inView}
        delay={0.2}
        duration={1}
        className="text-foreground/80"
      />
      <span className="inline-block h-4 w-2 animate-pulse bg-primary" />
    </div>
  );
}

export function LogModule({
  command,
  children,
}: {
  /** Text after the "$", e.g. "mount experience" */
  command: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEW);
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref}>
      {/* Mount bar: command, a line that draws across, then [ OK ] */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.3 }}
        className="mb-5 flex items-center gap-3 font-mono text-xs">
        <span className="text-muted-foreground">$ {command}</span>
        <motion.span
          className="h-px flex-1 origin-left border-t border-dashed border-border"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        <motion.span
          className="text-primary"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: 0.7 }}>
          [ OK ]
        </motion.span>
      </motion.div>

      {/* Content loads once the module reports OK */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.8 }}>
        {children}
      </motion.div>
    </div>
  );
}
