"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { verifySession } from "@/features/auth/lib/verify-session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import { projectSchema, type ProjectInput } from "../schema/project-schema";

const idSchema = z.uuid();

function toProjectRow(values: ProjectInput) {
  const technologies = [
    ...new Set(
      values.technologies
        .split(/[,\n]/)
        .map((technology) => technology.trim())
        .filter(Boolean),
    ),
  ];

  return {
    title: values.title,
    description: values.description,
    tech_stack: technologies,
    image_url: values.image,
    live_url: values.href || null,
    repo_url: values.github || null,
  };
}

function refreshProjects() {
  revalidatePath("/admin/projects");
  updateTag("projects");
}

export async function createProject(
  values: ProjectInput,
): Promise<ActionResult> {
  await verifySession();

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }

  const supabase = await createClient();

  const { data: lastProject, error: sortOrderError } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sortOrderError) {
    console.error("createProject sort-order lookup failed:", sortOrderError);
    return {
      ok: false,
      message: "Could not save the project. Please try again.",
    };
  }

  const { error } = await supabase.from("projects").insert({
    ...toProjectRow(parsed.data),
    sort_order: (lastProject?.sort_order ?? 0) + 100,
  });

  if (error) {
    console.error("createProject failed:", error);
    return {
      ok: false,
      message: "Could not save the project. Please try again.",
    };
  }

  refreshProjects();
  return { ok: true };
}

export async function updateProject(
  id: string,
  values: ProjectInput,
): Promise<ActionResult> {
  await verifySession();

  const parsedId = idSchema.safeParse(id);
  const parsed = projectSchema.safeParse(values);

  if (!parsedId.success || !parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update(toProjectRow(parsed.data))
    .eq("id", parsedId.data)
    .select("id");

  if (error) {
    console.error("updateProject failed:", error);
    return {
      ok: false,
      message: "Could not update the project. Please try again.",
    };
  }

  if (!data?.length) {
    return { ok: false, message: "Project not found." };
  }

  refreshProjects();
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await verifySession();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { ok: false, message: "Invalid project." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", parsedId.data)
    .select("id");

  if (error) {
    console.error("deleteProject failed:", error);
    return {
      ok: false,
      message: "Could not delete the project. Please try again.",
    };
  }

  if (!data?.length) {
    return { ok: false, message: "Project not found." };
  }

  refreshProjects();
  return { ok: true };
}
