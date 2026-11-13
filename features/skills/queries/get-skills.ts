import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/features/skills/types";

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();

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
