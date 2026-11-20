import Link from "next/link"; // Imports Link for navigating between pages without a full page reload.
import { Suspense, type ReactNode } from "react"; // Imports Suspense for loading states and ReactNode for typing child components.
import { connection } from "next/server"; // Imports connection to enable request-time rendering.
import { Button } from "@/components/ui/button"; // Imports the reusable Button component.
import { logout } from "@/features/auth/actions/logout"; // Imports the server action that logs out the user.
import { verifySession } from "@/features/auth/lib/verify-session"; // Imports the function that checks if the user is authenticated.

// Handles the shared layout and content of the admin dashboard.
async function AdminShell({ children }: { children: ReactNode }) {
  // Waits for a real request before running code that depends on request-specific data.
  await connection();

  const user = await verifySession(); // Verifies the user's session and retrieves their information.

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          {/* Navigation links for the admin dashboard. */}
          <nav aria-label="Admin" className="flex items-center gap-6 text-sm">
            <Link className="font-medium" href="/admin">
              Dashboard
            </Link>

            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin/skills">
              Skills
            </Link>

            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin/projects">
              Projects
            </Link>

            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/admin/experience">
              Experience
            </Link>

            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/"
              rel="noopener"
              target="_blank">
              {" "}
              {/* Opens the public website in a new browser tab. */}
              View site
            </Link>
          </nav>

          {/* Displays the logged-in user's email and logout button. */}
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email} {/* Displays the email of the authenticated user. */}
            </span>

            <form action={logout}>
              {" "}
              {/* Calls the logout server action when submitted. */}
              <Button size="sm" type="submit" variant="outline">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>{" "}
      {/* Displays the current admin page inside the shared layout. */}
    </div>
  );
}

// Main layout component for all admin dashboard pages.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={<p className="p-6 text-sm text-muted-foreground">Loading…</p>}>
      {" "}
      {/* Displays a loading message while AdminShell is loading. */}
      <AdminShell>{children}</AdminShell>{" "}
      {/* Wraps every admin page with the shared dashboard layout. */}
    </Suspense>
  );
}
