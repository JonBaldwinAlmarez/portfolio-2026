import { Suspense } from "react"; // Imports Suspense to handle components that load asynchronously.
import { connection } from "next/server"; // Imports connection to enable request-time rendering.
import { verifySession } from "@/features/auth/lib/verify-session"; // Imports the function that checks if the user has an active session.

// Handles the admin home page content.
async function AdminHome() {
  // Opts into request-time rendering before running other code.
  await connection();

  // Verifies the user's session and retrieves their information.
  const user = await verifySession();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as {user.email}{" "}
        {/* Displays the email of the logged-in user. */}
      </p>
    </div>
  );
}

// Main component for the admin page.
export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      {" "}
      {/* Handles the loading state while AdminHome is running. */}
      <AdminHome />
    </Suspense>
  );
}
