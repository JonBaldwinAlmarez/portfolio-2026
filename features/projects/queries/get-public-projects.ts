import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { ProjectRecord } from "@/features/projects/types/project-record";

export async function getPublicProjects(): Promise<ProjectRecord[]> {
  "use cache";
  cacheLife("days");
  cacheTag("projects");

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, description, technologies:tech_stack, href:live_url, image:image_url, github:repo_url, sort_order, created_at",
    )
    .eq("published", true)
    .eq("published", true)
    .order("sort_order")
    .order("created_at");

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return data as ProjectRecord[];
}
