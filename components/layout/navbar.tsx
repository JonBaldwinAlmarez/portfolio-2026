"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useActiveSection, useMediaQuery } from "@/hooks/use-active-section";

import { cn } from "@/lib/utils";

// Collects section IDs from navigation links for active-section tracking.
// Declared outside the component to maintain a stable array reference.
const sectionIds = [
  ...siteConfig.navigation.map((item) => item.href.replace("#", "")),
  "contact",
];

// Shared animation settings for the navbar links and menu button.
const fadeSlide = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

export function Navbar() {
  // Tracks whether the page has been scrolled beyond the initial threshold.
  const [isScrolled, setIsScrolled] = useState(false);

  // Controls the visibility of the mobile navigation menu.
  const [isOpen, setIsOpen] = useState(false);

  // Identifies the section currently active in the viewport.
  const activeId = useActiveSection(sectionIds);

  // Detects desktop viewport sizes to switch between navigation layouts.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Displays desktop navigation links only after the page is scrolled.
  const showLinks = isDesktop && isScrolled;

  // Updates the navbar appearance and closes the mobile menu when scrolling.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setIsOpen(false);
    };

    // Initializes the navbar state based on the current scroll position.
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Allows users to close the mobile menu using the Escape key.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    // Respects the user's operating system preference for reduced motion.
    <MotionConfig reducedMotion="user">
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-300",
          // Applies a translucent blurred background when scrolling or opening the menu.
          isScrolled || isOpen
            ? "border-border/70 bg-background/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}>
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          {/* Brand link navigates back to the home section. */}
          <Link
            className="font-heading text-lg font-semibold tracking-tight"
            href="#home">
            {siteConfig.name}
          </Link>

          {/* Animates the transition between desktop links and the mobile menu button. */}
          <AnimatePresence mode="wait" initial={false}>
            {showLinks ? (
              // Desktop navigation with an animated indicator for the active section.
              <motion.ul
                key="links"
                {...fadeSlide}
                className="flex items-center gap-1">
                {siteConfig.navigation.map((item) => {
                  const isActive = activeId === item.href.replace("#", "");

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "location" : undefined}
                        className={cn(
                          "relative px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
                        )}>
                        {item.label}

                        {/* Shared layout ID animates the active indicator between links. */}
                        {isActive && (
                          <motion.span
                            layoutId="active-link"
                            className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}

                {/* Provides a prominent link to the contact section. */}
                <li className="ml-3">
                  <Link
                    href="#contact"
                    className={buttonVariants({ size: "lg" })}>
                    Contact
                  </Link>
                </li>
              </motion.ul>
            ) : (
              // Mobile menu toggle displayed when desktop navigation is hidden.
              <motion.div key="hamburger" {...fadeSlide}>
                <button
                  type="button"
                  onClick={() => setIsOpen((open) => !open)}
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                  })}>
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
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Mobile navigation panel with animated height and opacity transitions. */}
        <AnimatePresence>
          {isOpen && !showLinks && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden">
              <ul className="mx-auto flex max-w-5xl flex-col gap-1 px-6 pb-6">
                {/* Combines configured navigation links with the contact link. */}
                {[
                  ...siteConfig.navigation,
                  { label: "Contact", href: "#contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      // Closes the menu after the user selects a navigation link.
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted",
                        // Highlights the link matching the currently active section.
                        activeId === item.href.replace("#", "")
                          ? "text-primary"
                          : "text-foreground",
                      )}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
