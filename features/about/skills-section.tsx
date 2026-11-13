import SkillsPanels from "@/features/about/skills-panels";
import { groupSkills } from "@/features/skills/lib/group-skills";
import { getPublicSkills } from "@/features/skills/queries/get-public-skills";

export default async function SkillsSection() {
  const skills = await getPublicSkills();

  if (skills.length === 0) return null;

  return <SkillsPanels groups={groupSkills(skills)} />;
}
