import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions/logout";
import { verifySession } from "@/features/auth/lib/verify-session";

async function AdminShell({ children }: { children: ReactNode }) {
  // Wait for a real request before anything runs (cacheComponents rule)
  await connection();
  const user = await verifySession();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <nav aria-label="Admin" className="flex items-center gap-6 text-sm">
            <Link className="font-medium" href="/admin">
              Dashboard
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/"
              rel="noopener"
              target="_blank">
              View site
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <form action={logout}>
              <Button size="sm" type="submit" variant="outline">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={<p className="p-6 text-sm text-muted-foreground">Loading…</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
