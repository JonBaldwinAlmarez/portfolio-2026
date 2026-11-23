import "server-only"; // Restricts this query to server-only code.
import { createClient } from "@/lib/supabase/server"; // Imports the server-side Supabase client.
import type { ProjectRecord } from "@/features/projects/types/project-record"; // Imports the project record type.

// Loads all projects for authenticated admin views.
export async function getProjects(): Promise<ProjectRecord[]> {
  const supabase = await createClient(); // Creates a Supabase client to access project data.

  // Queries projects and maps database columns to application field names.
  const { data, error } = await supabase
    .from("projects") // Selects the projects table.
    .select(
      "id, title, description, technologies:tech_stack, href:live_url, image:image_url, github:repo_url, sort_order, created_at",
    ) // Retrieves the fields used by project records.
    .order("sort_order") // Orders projects by their configured sort position.
    .order("created_at"); // Uses creation time as a tie-breaker.

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`); // Throws an error containing the database failure.
  }

  return data as ProjectRecord[]; // Returns the database rows as typed project records.
}
