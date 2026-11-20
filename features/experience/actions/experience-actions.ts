"use server"; // Tells Next.js to run these functions on the server.

import { revalidatePath, updateTag } from "next/cache"; // Imports functions to refresh pages and invalidate cached data.
import { z } from "zod"; // Imports Zod for validating form data.
import { verifySession } from "@/features/auth/lib/verify-session"; // Imports the function that checks if the user is authenticated.
import { createClient } from "@/lib/supabase/server"; // Imports the server-side Supabase client.
import { experienceSchema } from "@/features/experience/schema/experience-schema"; // Imports the validation rules for experience data.

// Defines the validation rule for experience IDs.
const idSchema = z.uuid(); // Requires the ID to be a valid UUID.

// Extracts and validates experience data from the submitted form.
function readExperience(formData: FormData) {
  // Checks if the submitted values follow the experience validation rules.
  const result = experienceSchema.safeParse({
    position: formData.get("position"), // Gets the job position.
    hours: formData.get("hours"), // Gets the number of hours.
    company: formData.get("company"), // Gets the company name.
    description: formData.get("description"), // Gets the experience description.
  });

  // Stops execution if the submitted data is invalid.
  if (!result.success) {
    throw new Error("Please check the experience fields and try again.");
  }

  return result.data; // Returns the validated experience data.
}

// Refreshes the admin page and public experience data.
function refreshExperiences() {
  revalidatePath("/admin/experience"); // Refreshes the admin experience page.
  updateTag("experiences"); // Invalidates cached experience data so updated records can be fetched.
}

// Creates a new experience record.
export async function createExperience(formData: FormData) {
  await verifySession(); // Checks if the user is authenticated before allowing changes.

  const experience = readExperience(formData); // Extracts and validates experience data from the form.
  const supabase = await createClient(); // Creates a Supabase client to access the database.

  // Gets the highest sort_order value from the experiences table.
  const { data: last, error: sortError } = await supabase
    .from("experiences") // Selects the experiences table.
    .select("sort_order") // Retrieves only the sort_order column.
    .order("sort_order", { ascending: false }) // Sorts records from highest to lowest.
    .limit(1) // Retrieves only the first record.
    .maybeSingle(); // Returns one record or null if the table is empty.

  // Stops execution if the sort_order lookup fails.
  if (sortError) {
    console.error("createExperience sort lookup failed:", sortError); // Logs the actual error for debugging.
    throw new Error("Could not save the experience."); // Returns a general error message.
  }

  // Inserts the new experience into the database.
  const { error } = await supabase.from("experiences").insert({
    ...experience, // Includes all the experience data from the form.
    sort_order: (last?.sort_order ?? 0) + 100, // Assigns a sort order 100 higher than the current highest value.
  });

  // Checks if the database insert failed.
  if (error) {
    console.error("createExperience failed:", error); // Logs the actual error for debugging.
    throw new Error("Could not save the experience."); // Returns a general error message.
  }

  refreshExperiences(); // Refreshes the admin page and cached experience data.
}

// Updates an existing experience record.
export async function updateExperience(formData: FormData) {
  await verifySession(); // Checks if the user is authenticated before allowing changes.

  // Validates the experience ID from the submitted form.
  const id = idSchema.safeParse(formData.get("id"));

  // Validates the experience fields from the submitted form.
  const experience = experienceSchema.safeParse({
    position: formData.get("position"), // Gets the job position.
    hours: formData.get("hours"), // Gets the number of hours.
    company: formData.get("company"), // Gets the company name.
    description: formData.get("description"), // Gets the experience description.
  });

  // Stops execution if the ID or experience fields are invalid.
  if (!id.success || !experience.success) {
    throw new Error("Please check the experience fields and try again.");
  }

  // Creates a Supabase client to access the database.
  const supabase = await createClient();

  // Updates the experience record that matches the provided ID.
  const { data, error } = await supabase
    .from("experiences") // Selects the experiences table.
    .update(experience.data) // Updates the record with the validated form data.
    .eq("id", id.data) // Targets the record with the matching ID.
    .select("id"); // Returns the ID of the updated record.

  // Checks if the database update failed.
  if (error) {
    console.error("updateExperience failed:", error); // Logs the actual error for debugging.
    throw new Error("Could not update the experience."); // Returns a general error message.
  }

  // Checks if no matching experience record was found.
  if (!data.length) {
    throw new Error("Experience not found.");
  }

  refreshExperiences(); // Refreshes the admin page and cached experience data.
}

// Deletes an existing experience record.
export async function deleteExperience(formData: FormData) {
  await verifySession(); // Checks if the user is authenticated before allowing changes.

  // Validates the experience ID from the submitted form.
  const id = idSchema.safeParse(formData.get("id"));

  // Stops execution if the ID is invalid.
  if (!id.success) {
    throw new Error("Invalid experience.");
  }

  // Creates a Supabase client to access the database.
  const supabase = await createClient();

  // Deletes the experience record that matches the provided ID.
  const { data, error } = await supabase
    .from("experiences") // Selects the experiences table.
    .delete() // Deletes the selected record.
    .eq("id", id.data) // Targets the record with the matching ID.
    .select("id"); // Returns the ID of the deleted record.

  // Checks if the database delete failed.
  if (error) {
    console.error("deleteExperience failed:", error); // Logs the actual error for debugging.
    throw new Error("Could not delete the experience."); // Returns a general error message.
  }

  // Checks if no matching experience record was found.
  if (!data.length) {
    throw new Error("Experience not found.");
  }

  refreshExperiences(); // Refreshes the admin page and cached experience data.
}
