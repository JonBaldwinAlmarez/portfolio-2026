import "server-only"; // Restricts this query to server-only code.
import { createClient } from "@/lib/supabase/server"; // Imports the server-side Supabase client.
import type { Skill } from "@/features/skills/types"; // Imports the skill record type.

// Loads all skills for authenticated admin views.
export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient(); // Creates a Supabase client.

  const { data, error } = await supabase
    .from("skills") // Selects the skills table.
    .select("id, name, category, sort_order, created_at") // Retrieves all skill fields used by the app.
    .order("sort_order") // Orders skills within their configured positions.
    .order("name"); // Uses name as a tie-breaker.

  if (error) {
    throw new Error(`Failed to load skills: ${error.message}`);
  }

  return data as Skill[];
}
