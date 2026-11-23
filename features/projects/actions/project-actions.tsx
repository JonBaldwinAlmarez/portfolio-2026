"use server"; // Tells Next.js to run these functions on the server.

import { revalidatePath, updateTag } from "next/cache"; // Imports functions to refresh pages and invalidate cached data.
import { z } from "zod"; // Imports Zod for validating project data.
import { verifySession } from "@/features/auth/lib/verify-session"; // Imports the function that checks if the user is authenticated.
import { createClient } from "@/lib/supabase/server"; // Imports the server-side Supabase client.
import type { ActionResult } from "@/lib/action-result"; // Imports the shared action result type.
import { projectSchema, type ProjectInput } from "../schema/project-schema"; // Imports project validation rules and form value types.

const idSchema = z.uuid(); // Requires project IDs to be valid UUIDs.

// Converts a title into a URL-friendly slug.
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toProjectRow(values: ProjectInput) {
  const technologies = [
    ...new Set(
      values.technologies
        .split(/[,\n]/) // Splits technologies separated by commas or line breaks.
        .map((technology) => technology.trim()) // Removes whitespace from each technology.
        .filter(Boolean), // Removes empty technology entries.
    ),
  ];

  return {
    title: values.title, // Maps the project title to the database column.
    description: values.description, // Maps the project description to the database column.
    tech_stack: technologies, // Maps the technology list to the database column.
    image_url: values.image, // Maps the project image URL to the database column.
    live_url: values.href || null, // Stores null when no live URL is provided.
    repo_url: values.github || null, // Stores null when no repository URL is provided.
  };
}

// Refreshes the project admin page and public project cache.
function refreshProjects() {
  revalidatePath("/admin/projects"); // Refreshes the admin projects page.
  updateTag("projects"); // Invalidates cached project data.
}

// Creates a new project record.
export async function createProject(
  values: ProjectInput,
): Promise<ActionResult> {
  await verifySession(); // Checks if the user is authenticated before allowing changes.

  const parsed = projectSchema.safeParse(values); // Validates project data at runtime.
  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." }; // Returns a validation error.
  }

  const supabase = await createClient(); // Creates a Supabase client to access the database.

  // Gets the highest sort_order value from the projects table.
  const { data: lastProject, error: sortOrderError } = await supabase
    .from("projects") // Selects the projects table.
    .select("sort_order") // Retrieves only the sort_order column.
    .order("sort_order", { ascending: false }) // Sorts records from highest to lowest.
    .limit(1) // Retrieves only the first record.
    .maybeSingle(); // Returns one record or null if the table is empty.

  if (sortOrderError) {
    console.error("createProject sort-order lookup failed:", sortOrderError); // Logs the lookup error for debugging.
    return {
      ok: false,
      message: "Could not save the project. Please try again.", // Returns a general save error.
    };
  }

  // Inserts the new project into the database.
  const { error } = await supabase.from("projects").insert({
    ...toProjectRow(parsed.data), // Includes the mapped project form values.
    slug: slugify(parsed.data.title), // Creates a URL-friendly slug from the title.
    summary: parsed.data.description, // Uses the description as the project summary.
    featured: false, // Creates the project as not featured.
    published: true, // Makes the project publicly available.
    sort_order: (lastProject?.sort_order ?? 0) + 100, // Assigns a sort order after the current highest value.
  });

  if (error) {
    console.error("createProject failed:", error); // Logs the insert error for debugging.
    return {
      ok: false,
      message: "Could not save the project. Please try again.", // Returns a general save error.
    };
  }

  refreshProjects(); // Refreshes project pages and cached data.
  return { ok: true }; // Reports that the project was created.
}

// Updates an existing project record.
export async function updateProject(
  id: string,
  values: ProjectInput,
): Promise<ActionResult> {
  await verifySession(); // Checks if the user is authenticated before allowing changes.

  const parsedId = idSchema.safeParse(id); // Validates the project ID.
  const parsed = projectSchema.safeParse(values); // Validates the updated project data.

  if (!parsedId.success || !parsed.success) {
    return { ok: false, message: "Please check the form and try again." }; // Returns a validation error.
  }

  const supabase = await createClient(); // Creates a Supabase client to access the database.

  // Updates the project that matches the provided ID.
  const { data, error } = await supabase
    .from("projects") // Selects the projects table.
    .update(toProjectRow(parsed.data)) // Updates the record with validated form data.
    .eq("id", parsedId.data) // Targets the project with the matching ID.
    .select("id"); // Returns the ID of the updated record.

  if (error) {
    console.error("updateProject failed:", error); // Logs the update error for debugging.
    return {
      ok: false,
      message: "Could not update the project. Please try again.", // Returns a general update error.
    };
  }

  if (!data?.length) {
    return { ok: false, message: "Project not found." }; // Returns an error when no project matches the ID.
  }

  refreshProjects(); // Refreshes project pages and cached data.
  return { ok: true }; // Reports that the project was updated.
}

// Deletes an existing project record.
export async function deleteProject(id: string): Promise<ActionResult> {
  await verifySession(); // Checks if the user is authenticated before allowing changes.

  const parsedId = idSchema.safeParse(id); // Validates the project ID.
  if (!parsedId.success) {
    return { ok: false, message: "Invalid project." }; // Returns an error for an invalid ID.
  }

  const supabase = await createClient(); // Creates a Supabase client to access the database.

  // Deletes the project that matches the provided ID.
  const { data, error } = await supabase
    .from("projects") // Selects the projects table.
    .delete() // Deletes the matching project record.
    .eq("id", parsedId.data) // Targets the project with the matching ID.
    .select("id"); // Returns the ID of the deleted record.

  if (error) {
    console.error("deleteProject failed:", error); // Logs the delete error for debugging.
    return {
      ok: false,
      message: "Could not delete the project. Please try again.", // Returns a general delete error.
    };
  }

  if (!data?.length) {
    return { ok: false, message: "Project not found." }; // Returns an error when no project matches the ID.
  }

  refreshProjects(); // Refreshes project pages and cached data.
  return { ok: true }; // Reports that the project was deleted.
}
