import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { verifySession } from "@/features/auth/lib/verify-session";

export const metadata: Metadata = { title: "Dashboard" };

async function DashboardContent() {
  await connection();
  const user = await verifySession();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
