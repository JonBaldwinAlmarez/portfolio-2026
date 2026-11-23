import { cacheLife, cacheTag } from "next/cache"; // Imports Next.js cache configuration helpers.
import { createPublicClient } from "@/lib/supabase/public"; // Imports the public Supabase client.
import type { Skill } from "@/features/skills/types"; // Imports the skill record type.

// Loads skills for public portfolio views.
export async function getPublicSkills(): Promise<Skill[]> {
  "use cache"; // Enables caching for this server query.
  cacheLife("days"); // Keeps the cached data for the daily cache duration.
  cacheTag("skills"); // Tags the cache for skill updates.

  const supabase = createPublicClient(); // Creates a public Supabase client.

  const { data, error } = await supabase
    .from("skills") // Selects the skills table.
    .select("id, name, category, sort_order, created_at") // Retrieves public skill fields.
    .order("sort_order") // Orders skills by configured position.
    .order("name"); // Uses name as a tie-breaker.

  if (error) {
    throw new Error(`Failed to load skills: ${error.message}`);
  }

  return data as Skill[];
}
