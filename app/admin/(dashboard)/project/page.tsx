import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { verifySession } from "@/features/auth/lib/verify-session";
import ProjectsManager from "@/features/projects/components/projects-manager";
import { getProjects } from "@/features/projects/queries/get-projects";

export const metadata: Metadata = { title: "Projects" };

async function ProjectsContent() {
  await connection();
  await verifySession();

  const projects = await getProjects();

  return <ProjectsManager projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Suspense
        fallback={
          <div aria-busy="true">
            <h1 className="font-heading text-3xl font-semibold">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Loading projects…
            </p>
          </div>
        }>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}
