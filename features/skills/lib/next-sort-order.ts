import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

const BLOCK_SIZE = 100;

// Returns the sort_order a skill should get so it lands at the end of its category.
export async function getNextSortOrder(
  supabase: SupabaseClient,
  category: string,
): Promise<number> {
  const { data: lastInCategory } = await supabase
    .from("skills")
    .select("sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastInCategory) return lastInCategory.sort_order + 1;

  const { data: last } = await supabase
    .from("skills")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const highest = last?.sort_order ?? 0;
  return Math.floor(highest / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE + 1;
}
