"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/features/auth/lib/verify-session";
import { skillSchema, type SkillInput } from "../schema/skill-schema";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const UNIQUE_VIOLATION = "23505";

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
  const { error } = await supabase.from("skills").insert(parsed.data);

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
  return { ok: true };
}

// Update and delete

const idSchema = z.uuid();

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
  const { data, error } = await supabase
    .from("skills")
    .update(parsed.data)
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
  return { ok: true };
}
