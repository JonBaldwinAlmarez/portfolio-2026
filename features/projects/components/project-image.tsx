"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Code, ExternalLink } from "lucide-react";

import { CyberText } from "@/components/shared/CyberText";
import { cn } from "@/lib/utils";

export function ProjectImage({
  src,
  title,
  href,
  github,
}: {
  src: string;
  title: string;
  href?: string;
  github?: string;
}) {
  // true while the mouse is over the image, or a link inside has keyboard focus
  const [active, setActive] = useState(false);

  const links = [
    href && {
      label: "Live site",
      aria: `View ${title} live site`,
      url: href,
      icon: <ExternalLink className="size-5" />,
    },
    github && {
      label: "Source code",
      aria: `View ${title} source code on GitHub`,
      url: github,
      icon: <Code className="size-5" />,
    },
  ].filter(Boolean) as {
    label: string;
    aria: string;
    url: string;
    icon: React.ReactNode;
  }[];

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-lg"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}>
      <Image
        src={src}
        alt={title}
        fill
        sizes="(min-width: 640px) 50vw, 100vw"
        className={cn(
          "object-cover transition duration-500 ease-out motion-reduce:transition-none",
          active
            ? "scale-110 brightness-50 grayscale-0 motion-reduce:scale-100"
            : "brightness-75 grayscale",
        )}
      />

      {/* Overlay: always in the page (so keyboard users can tab to it) but invisible until active */}
      {links.length > 0 && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-8 transition-opacity duration-300",
            active ? "opacity-100" : "pointer-events-none opacity-0",
          )}>
          {links.map((link, index) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.aria}
              className="group/link flex flex-col items-center gap-2 outline-none">
              <span className="grid size-12 place-items-center rounded-full border border-primary/60 bg-background/70 text-primary backdrop-blur-sm transition-[box-shadow,background-color] group-hover/link:bg-primary/20 group-hover/link:shadow-[0_0_18px_-2px_var(--primary)] group-focus-visible/link:ring-3 group-focus-visible/link:ring-ring/50">
                {link.icon}
              </span>

              {/* Mounted only while active, so the decode restarts on every hover */}
              <span aria-hidden className="font-mono text-xs text-foreground">
                {active && (
                  <CyberText
                    text={link.label}
                    delay={0.05 + index * 0.15}
                    duration={0.5}
                    scan={false}
                    className="text-center"
                  />
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
