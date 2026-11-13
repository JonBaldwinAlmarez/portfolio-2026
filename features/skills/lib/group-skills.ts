import type { PublicSkill, Skill, SkillGroup } from "@/features/skills/types";

export function groupSkills(skills: Skill[]): SkillGroup[] {
  const groups = new Map<string, PublicSkill[]>();

  for (const { id, name, category } of skills) {
    const items = groups.get(category) ?? [];
    items.push({ id, name });
    groups.set(category, items);
  }

  return Array.from(groups, ([category, items]) => ({ category, items }));
}
