export type Skill = {
  id: string;
  name: string;
  category: string;
  sort_order: number;
  created_at: string;
};

export type PublicSkill = Pick<Skill, "id" | "name">;

export type SkillGroup = {
  category: string;
  items: PublicSkill[];
};
