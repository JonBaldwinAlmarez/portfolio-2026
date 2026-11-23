"use server"; // Tells Next.js to run these functions on the server.

import { revalidatePath, updateTag } from "next/cache"; // Imports cache refresh helpers.
import { verifySession } from "@/features/auth/lib/verify-session"; // Checks whether the user is authenticated.
import { getNextSortOrder } from "@/features/skills/lib/next-sort-order"; // Finds the next sort position for a category.
import { skillSchema, type SkillInput } from "../schema/skill-schema"; // Imports skill validation rules and types.
import type { ActionResult } from "@/lib/action-result"; // Imports the shared action result type.
import { createClient } from "@/lib/supabase/server"; // Imports the server-side Supabase client.
import { z } from "zod"; // Imports Zod for validating skill IDs.

const UNIQUE_VIOLATION = "23505"; // Identifies a database unique constraint violation.
const idSchema = z.uuid(); // Requires skill IDs to be valid UUIDs.

// Creates a new skill record.
export async function createSkill(values: SkillInput): Promise<ActionResult> {
  // 1. Authenticate first. Server Actions are public endpoints.
  await verifySession();

  // 2. Validate. TypeScript types don't exist at runtime.
  const parsed = skillSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }

  // 3. Write.
  const supabase = await createClient();
  const sort_order = await getNextSortOrder(supabase, parsed.data.category);
  const { error } = await supabase
    .from("skills")
    .insert({ ...parsed.data, sort_order });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { ok: false, message: "That skill already exists." };
    }
    console.error("createSkill failed:", error);
    return {
      ok: false,
      message: "Could not save the skill. Please try again.",
    };
  }

  // 4. Refresh the admin page so the new skill appears.
  revalidatePath("/admin/skills");
  updateTag("skills");
  return { ok: true };
}

// Update and delete

export async function updateSkill(
  id: string,
  values: SkillInput,
): Promise<ActionResult> {
  await verifySession(); // Verifies authentication before updating.

  const parsedId = idSchema.safeParse(id); // Validates the skill ID.
  const parsed = skillSchema.safeParse(values); // Validates the submitted skill values.
  if (!parsedId.success || !parsed.success) {
    return { ok: false, message: "Please check the form and try again." }; // Stops when validation fails.
  }

  const supabase = await createClient(); // Creates a Supabase client.
  const { data: currentSkill, error: currentSkillError } = await supabase
    .from("skills") // Selects the skills table.
    .select("category") // Retrieves the current category.
    .eq("id", parsedId.data) // Targets the requested skill.
    .maybeSingle(); // Returns one record or null.

  if (currentSkillError) {
    console.error("updateSkill failed:", currentSkillError);
    return {
      ok: false,
      message: "Could not update the skill. Please try again.",
    };
  }

  if (!currentSkill) {
    return { ok: false, message: "Skill not found." };
  }

  const updateData =
    currentSkill.category !== parsed.data.category
      ? {
          ...parsed.data,
          sort_order: await getNextSortOrder(supabase, parsed.data.category), // Moves the skill to the end of the new category.
        }
      : parsed.data;

  const { data, error } = await supabase
    .from("skills")
    .update(updateData)
    .eq("id", parsedId.data)
    .select("id");

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { ok: false, message: "That skill already exists." };
    }
    console.error("updateSkill failed:", error);
    return {
      ok: false,
      message: "Could not update the skill. Please try again.",
    };
  }

  if (!data?.length) {
    return { ok: false, message: "Skill not found." };
  }

  revalidatePath("/admin/skills");
  updateTag("skills");
  return { ok: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await verifySession(); // Verifies authentication before deleting.

  const parsedId = idSchema.safeParse(id); // Validates the skill ID.
  if (!parsedId.success) {
    return { ok: false, message: "Invalid skill." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .delete()
    .eq("id", parsedId.data)
    .select("id");

  if (error) {
    console.error("deleteSkill failed:", error);
    return {
      ok: false,
      message: "Could not delete the skill. Please try again.",
    };
  }

  if (!data?.length) {
    return { ok: false, message: "Skill not found." };
  }

  revalidatePath("/admin/skills");
  updateTag("skills");
  return { ok: true };
}
