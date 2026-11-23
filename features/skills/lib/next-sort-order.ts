import "server-only"; // Restricts this helper to server-only code.
import type { SupabaseClient } from "@supabase/supabase-js"; // Imports the Supabase client type.

const BLOCK_SIZE = 100;

// Returns the sort_order a skill should get so it lands at the end of its category.
export async function getNextSortOrder(
  supabase: SupabaseClient,
  category: string,
): Promise<number> {
  const { data: lastInCategory } = await supabase
    .from("skills") // Selects the skills table.
    .select("sort_order") // Retrieves only sort positions.
    .eq("category", category) // Filters to the requested category.
    .order("sort_order", { ascending: false }) // Finds the highest position.
    .limit(1) // Retrieves one record.
    .maybeSingle(); // Returns one record or null.

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
