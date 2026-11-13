import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Skill } from "@/features/skills/types";

export async function getPublicSkills(): Promise<Skill[]> {
  "use cache";
  cacheLife("days");
  cacheTag("skills");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("skills")
    .select("id, name, category, sort_order, created_at")
    .order("sort_order")
    .order("name");

  if (error) {
    throw new Error(`Failed to load skills: ${error.message}`);
  }

  return data as Skill[];
}
