"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Direction = "clockwise" | "counterclockwise";

type BaseProps = {
  /** Which way the border gradient rotates. Defaults to clockwise. */
  direction?: Direction;
};
type ButtonProps = React.ComponentProps<"button"> &
  BaseProps & { href?: undefined };
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  BaseProps & { href: string };
type AnimatedButtonProps = ButtonProps | AnchorProps;

/**
 * AnimatedButton
 * Gradient border that rotates around the button continuously
 * (it does not pause on hover, focus or click).
 * Renders a <button> by default, or a link when `href` is passed:
 *  - hash links (#section, /#section) -> plain <a> (native scroll)
 *  - other internal hrefs             -> next/link
 *  - external href / download         -> plain <a>
 * Tailwind classes only, no globals.css changes needed.
 */
export function AnimatedButton({
  children,
  className,
  direction = "clockwise",
  ...props
}: AnimatedButtonProps) {
  const classes = cn(
    "group relative inline-flex h-11 cursor-pointer items-center justify-center overflow-hidden",
    "rounded-full p-0.5",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    className,
  );

  const inner = (
    <>
      {/* Rotating gradient (shows through as the border) */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2",
          "bg-[conic-gradient(transparent_25%,var(--primary),var(--chart-5)_99%,transparent)]",
          direction === "clockwise"
            ? "animate-[spin_3s_linear_infinite]"
            : "animate-[spin_3s_linear_infinite_reverse]",
          "motion-reduce:animate-none",
        )}
      />
      {/* Button face */}
      <span
        className={cn(
          "relative inline-flex h-full w-full items-center justify-center rounded-full px-7",
          "bg-linear-to-b from-card to-background",
          "text-sm font-medium text-foreground",
        )}>
        {children}
      </span>
    </>
  );

  if ("href" in props && typeof props.href === "string") {
    const { href, download, ...anchorProps } = props as AnchorProps;
    const usePlainAnchor =
      download !== undefined ||
      /^(https?:)?\/\//.test(href) ||
      href.includes("#");

    if (usePlainAnchor) {
      return (
        <a href={href} download={download} className={classes} {...anchorProps}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonProps)}>
      {inner}
    </button>
  );
}
