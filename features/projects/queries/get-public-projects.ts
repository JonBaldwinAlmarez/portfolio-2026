import { cacheLife, cacheTag } from "next/cache"; // Imports Next.js cache configuration helpers.
import { createPublicClient } from "@/lib/supabase/public"; // Imports the public Supabase client.
import type { ProjectRecord } from "@/features/projects/types/project-record"; // Imports the project record type.

// Loads published projects for public portfolio views.
export async function getPublicProjects(): Promise<ProjectRecord[]> {
  "use cache"; // Enables caching for this server query.
  cacheLife("days"); // Keeps the cached data for the configured daily cache duration.
  cacheTag("projects"); // Tags the cache so project updates can invalidate it.

  const supabase = createPublicClient(); // Creates a client with public read access.

  // Queries only published projects and maps database columns to application fields.
  const { data, error } = await supabase
    .from("projects") // Selects the projects table.
    .select(
      "id, title, description, technologies:tech_stack, href:live_url, image:image_url, github:repo_url, sort_order, created_at",
    ) // Retrieves the fields used by public project records.
    .eq("published", true) // Filters out unpublished projects.
    .eq("published", true) // Reapplies the published filter for the public query.
    .order("sort_order") // Orders projects by their configured sort position.
    .order("created_at"); // Uses creation time as a tie-breaker.

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`); // Throws an error containing the database failure.
  }

  return data as ProjectRecord[]; // Returns the database rows as typed project records.
}
