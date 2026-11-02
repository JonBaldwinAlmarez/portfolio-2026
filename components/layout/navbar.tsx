"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

// Combines the configured navigation links with the contact link.
const menuItems = [
  ...siteConfig.navigation,
  { label: "Contact", href: "#contact" },
];

// Extracts section IDs used to track the currently active navigation item.
const sectionIds = menuItems.map((item) => item.href.replace("#", ""));

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  // True once the home section has been scrolled out of view.
  const [isVisible, setIsVisible] = useState(false);

  // Controls the visibility of the mobile dropdown menu.
  const [isOpen, setIsOpen] = useState(false);

  // Identifies the section currently active in the viewport.
  const activeId = useActiveSection(sectionIds);

  // Detects desktop viewport sizes to determine which navigation layout to display.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Shows the navbar only after the user scrolls past the home section.
  useEffect(() => {
    const home = document.getElementById("home");

    // Fallback if there is no #home section: show after most of a screen.
    if (!home) {
      const onScroll = () =>
        setIsVisible(window.scrollY > window.innerHeight * 0.6);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // The top margin makes the navbar appear as the home section's bottom edge
    // passes 80px from the top of the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const pastHome = !entry.isIntersecting;
        setIsVisible(pastHome);
        if (!pastHome) setIsOpen(false);
      },
      { rootMargin: "-80px 0px 0px 0px" },
    );

    observer.observe(home);
    return () => observer.disconnect();
  }, []);

  // Closes the dropdown when the user scrolls while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [isOpen]);

  return (
    // Respects the user's system preference for reduced motion.
    <MotionConfig reducedMotion="user">
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              key="pill"
              className="pointer-events-auto relative max-w-full"
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -24,
                scale: 0.9,
                // Waits for the light effects to play in reverse first.
                transition: { duration: 0.35, delay: 0.25, ease: "easeIn" },
              }}
              transition={{ duration: 0.45, delay: 0.1, ease }}>
              {/* Flash: a burst of cyan light that settles into a soft glow. */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-full shadow-[0_0_40px_6px_var(--primary)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.25] }}
                exit={{
                  opacity: [0.25, 1, 0],
                  transition: { duration: 0.5, times: [0, 0.5, 1] },
                }}
                transition={{ duration: 0.8, times: [0, 0.35, 1] }}
              />

              {/* Pill body */}
              <div className="relative overflow-hidden rounded-full border border-primary/25 bg-background/70 backdrop-blur-xl">
                {/* Light sweep that crosses the pill (reversed when leaving). */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/40 to-transparent"
                  style={{ skewX: -12 }}
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "350%", opacity: [0, 1, 1, 0] }}
                  exit={{
                    x: "-100%",
                    opacity: [0, 1, 1, 0],
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                  transition={{ duration: 0.7, delay: 0.15, ease: "easeInOut" }}
                />

                <nav
                  aria-label="Main navigation"
                  className="relative flex items-center p-1.5">
                  {isDesktop ? (
                    // Desktop: links with a sliding highlight, plus a Contact button.
                    <ul className="flex items-center gap-1">
                      {siteConfig.navigation.map((item) => {
                        const isActive =
                          activeId === item.href.replace("#", "");

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              aria-current={isActive ? "location" : undefined}
                              className={cn(
                                "relative block rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
                              )}>
                              {/* Highlight that slides between the links. */}
                              {isActive && (
                                <motion.span
                                  layoutId="active-pill"
                                  className="absolute inset-0 rounded-full bg-primary/15"
                                  transition={{
                                    type: "spring",
                                    bounce: 0.2,
                                    duration: 0.5,
                                  }}
                                />
                              )}
                              <span className="relative">{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}

                      <li className="ml-1">
                        <Button
                          size="lg"
                          className="rounded-full"
                          nativeButton={false}
                          render={<Link href="#contact" />}>
                          Contact
                        </Button>
                      </li>
                    </ul>
                  ) : (
                    // Mobile: brand name and a menu button.
                    <div className="flex items-center gap-2 pl-4">
                      <Link
                        className="font-heading text-base font-semibold tracking-tight"
                        href="#home">
                        {siteConfig.name}
                      </Link>

                      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              aria-label={isOpen ? "Close menu" : "Open menu"}
                            />
                          }>
                          {/* Animates the transition between the menu and close icons. */}
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={isOpen ? "close" : "open"}
                              initial={{ rotate: -90, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              exit={{ rotate: 90, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex">
                              {isOpen ? <X /> : <Menu />}
                            </motion.span>
                          </AnimatePresence>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          sideOffset={12}
                          className="w-48">
                          {menuItems.map((item) => (
                            <DropdownMenuItem
                              key={item.href}
                              render={<Link href={item.href} />}
                              className={cn(
                                "py-2 text-base",
                                // Highlights the dropdown item matching the active section.
                                activeId === item.href.replace("#", "") &&
                                  "text-primary",
                              )}>
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
