import type { Metadata } from "next";
import { connection } from "next/server";
import { verifySession } from "@/features/auth/lib/verify-session";
import SkillsManager from "@/skills/components/skills-manager";
import { getSkills } from "@/features/skills/queries/get-skills";

export const metadata: Metadata = { title: "Skills" };

export default async function SkillsPage() {
  await connection();
  await verifySession();

  const skills = await getSkills();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <SkillsManager skills={skills} />
    </div>
  );
}
