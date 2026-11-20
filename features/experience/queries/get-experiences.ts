import "server-only"; // Prevents this file from being imported into client-side components.
import type { ExperienceRecord } from "../types"; // Imports the TypeScript type for experience records.
import { createClient } from "@/lib/supabase/server"; // Imports the server-side Supabase client.
import { cacheLife, cacheTag } from "next/cache"; // Imports functions for controlling and identifying cached data.
import { createPublicClient } from "@/lib/supabase/public"; // Imports the public Supabase client.

// Defines the database columns to retrieve from the experiences table.
const columns =
  "id, position, hours, company, description, sort_order, created_at";

// Fetches experience records for the admin dashboard.
export async function getAdminExperiences(): Promise<ExperienceRecord[]> {
  // Creates a Supabase client using the current server session.
  const supabase = await createClient();

  // Fetches experiences and sorts them by sort_order, then by creation date.
  const { data, error } = await supabase
    .from("experiences") // Selects the experiences table.
    .select(columns) // Retrieves only the specified columns.
    .order("sort_order") // Sorts records based on their display order.
    .order("created_at"); // Uses creation date when sort_order values are equal.

  // Stops execution if Supabase returns an error.
  if (error) {
    throw new Error(`Failed to load experience: ${error.message}`);
  }

  return data as ExperienceRecord[]; // Returns the fetched records as ExperienceRecord objects.
}

// Fetches experience records for the public website.
export async function getPublicExperiences(): Promise<ExperienceRecord[]> {
  "use cache"; // Enables caching for this function's result.
  cacheLife("days"); // Keeps the cached data for the configured days cache profile.
  cacheTag("experiences"); // Adds a tag so this cached data can be revalidated when experiences change.

  // Creates a public Supabase client without using the user's session.
  const supabase = createPublicClient();

  // Fetches experiences and sorts them by sort_order, then by creation date.
  const { data, error } = await supabase
    .from("experiences") // Selects the experiences table.
    .select(columns) // Retrieves only the specified columns.
    .order("sort_order") // Sorts records based on their display order.
    .order("created_at"); // Uses creation date when sort_order values are equal.

  // Stops execution if Supabase returns an error.
  if (error) {
    throw new Error(`Failed to load experiences: ${error.message}`);
  }

  return data as ExperienceRecord[]; // Returns the fetched records as ExperienceRecord objects.
}
