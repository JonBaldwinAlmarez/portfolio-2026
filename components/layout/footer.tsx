import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {siteConfig.name}</p>
        <Link className="hover:text-foreground" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </Link>
      </div>
    </footer>
  );
}
