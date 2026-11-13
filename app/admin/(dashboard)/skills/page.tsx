import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { verifySession } from "@/features/auth/lib/verify-session";
import SkillsManager from "@/skills/components/skills-manager";
import { getSkills } from "@/features/skills/queries/get-skills";

export const metadata: Metadata = { title: "Skills" };

async function SkillsContent() {
  await connection();
  await verifySession();

  const skills = await getSkills();

  return <SkillsManager skills={skills} />;
}

export default function SkillsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Suspense
        fallback={
          <div aria-busy="true">
            <h1 className="font-heading text-3xl font-semibold">Skills</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Loading skills…
            </p>
          </div>
        }>
        <SkillsContent />
      </Suspense>
    </div>
  );
}
