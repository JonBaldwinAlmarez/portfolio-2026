import { siteConfig } from "@/config/site";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

async function CurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-heading text-lg font-semibold">
            {siteConfig.name}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Write Clean, Maintainable and Reliable code
          </p>
        </div>

        {/* Navigate column goes here */}

        <nav aria-labelledby="footer-nav-heading">
          <h2 className="text-sm font-medium" id="footer-nav-heading">
            Navigate
          </h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Connect column goes here (Piece 3) */}

        <div>
          <h2 className="text-sm font-medium">Connect</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <li>
              <a
                className="break-all rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar goes here (Piece 4) */}

      <div>
        <div>
          <p>
            © <CurrentYear />
            {siteConfig.name}. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
