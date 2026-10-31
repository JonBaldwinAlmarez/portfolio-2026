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

// Shared animation settings for the navbar's entrance and exit transitions.
const fadeSlide = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

export function Navbar() {
  // Tracks whether the page has been scrolled beyond the initial threshold.
  const [isScrolled, setIsScrolled] = useState(false);

  // Controls the visibility of the mobile dropdown menu.
  const [isOpen, setIsOpen] = useState(false);

  // Identifies the section currently active in the viewport.
  const activeId = useActiveSection(sectionIds);

  // Detects desktop viewport sizes to determine which navigation layout to display.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Shows desktop navigation links only when the viewport is desktop-sized and scrolled.
  const showLinks = isDesktop && isScrolled;

  // Updates the navbar appearance and closes the dropdown when the user scrolls.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setIsOpen(false); // Closes the dropdown when the user scrolls.
    };

    // Initializes the navbar state using the current scroll position.
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Respects the user's system preference for reduced motion.
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

          {/* Animates the transition between desktop navigation and the mobile menu. */}
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

                        {/* Animates the active indicator between navigation links. */}
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

                {/* Uses the shared Shadcn button component as a navigation link. */}
                <li className="ml-3">
                  <Button
                    size="lg"
                    nativeButton={false}
                    render={<Link href="#contact" />}>
                    Contact
                  </Button>
                </li>
              </motion.ul>
            ) : (
              // Mobile dropdown trigger displayed when desktop navigation is hidden.
              <motion.div key="hamburger" {...fadeSlide}>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  {/* Controls the dropdown visibility and displays the animated menu icon. */}
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
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

                  {/* Displays the mobile navigation links in an aligned dropdown panel. */}
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
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
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </MotionConfig>
  );
}
