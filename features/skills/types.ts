export type Skill = {
  // Defines a complete skill database record.
  id: string;
  name: string;
  category: string;
  sort_order: number;
  created_at: string;
};

export type PublicSkill = Pick<Skill, "id" | "name">;

export type SkillGroup = {
  // Defines a category and its public skills.
  category: string;
  items: PublicSkill[];
};
