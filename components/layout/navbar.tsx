import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4"
      >
        <Link
          className="font-heading text-lg font-semibold tracking-tight"
          href="/"
        >
          {siteConfig.name}
        </Link>
        <ul className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          {siteConfig.navigation.map((item) => (
            <li key={item.href}>
              <Link
                className="transition-colors hover:text-foreground focus-visible:text-foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
