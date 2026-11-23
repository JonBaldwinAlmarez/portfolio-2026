import type { PublicSkill, Skill, SkillGroup } from "@/features/skills/types"; // Imports skill grouping types.

// Groups skill records under their category names.
export function groupSkills(skills: Skill[]): SkillGroup[] {
  const groups = new Map<string, PublicSkill[]>();

  for (const { id, name, category } of skills) {
    const items = groups.get(category) ?? []; // Gets or creates the category's item list.
    items.push({ id, name }); // Adds the public skill fields to the group.
    groups.set(category, items); // Stores the updated category group.
  }

  return Array.from(groups, ([category, items]) => ({ category, items }));
}
