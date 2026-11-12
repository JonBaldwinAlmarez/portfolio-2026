"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/features/auth/lib/verify-session";
import { skillSchema, type SkillInput } from "../schema/skill-schema";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

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
