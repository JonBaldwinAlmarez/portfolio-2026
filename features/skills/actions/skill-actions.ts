"use server";

import { revalidatePath, updateTag } from "next/cache";
import { verifySession } from "@/features/auth/lib/verify-session";
import { getNextSortOrder } from "@/features/skills/lib/next-sort-order";
import { skillSchema, type SkillInput } from "../schema/skill-schema";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const UNIQUE_VIOLATION = "23505";
const idSchema = z.uuid();

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
  await verifySession();

  const parsedId = idSchema.safeParse(id);
  const parsed = skillSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data: currentSkill, error: currentSkillError } = await supabase
    .from("skills")
    .select("category")
    .eq("id", parsedId.data)
    .maybeSingle();

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
          sort_order: await getNextSortOrder(supabase, parsed.data.category),
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
  await verifySession();

  const parsedId = idSchema.safeParse(id);
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
