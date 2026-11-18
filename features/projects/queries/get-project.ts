import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRecord } from "@/features/projects/types/project-record";

export async function getProjects(): Promise<ProjectRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, description, technologies, href, image, github, sort_order, created_at",
    )
    .order("sort_order")
    .order("created_at");

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return data as ProjectRecord[];
}
