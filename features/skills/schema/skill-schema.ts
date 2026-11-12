import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a skill name.")
    .max(60, "Name is too long (60 characters max)."),
  category: z
    .string()
    .trim()
    .min(1, "Enter a category.")
    .max(60, "Category is too long (60 characters max)."),
});

export type SkillInput = z.infer<typeof skillSchema>;
