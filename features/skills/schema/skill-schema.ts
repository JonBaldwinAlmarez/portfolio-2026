import { z } from "zod"; // Imports Zod for runtime skill validation.

// Defines validated skill name and category fields.
export const skillSchema = z.object({
  name: z
    .string()
    .trim() // Removes surrounding whitespace.
    .min(1, "Enter a skill name.") // Requires a skill name.
    .max(60, "Name is too long (60 characters max)."), // Limits the name length.
  category: z
    .string()
    .trim() // Removes surrounding whitespace.
    .min(1, "Enter a category.") // Requires a category.
    .max(60, "Category is too long (60 characters max)."), // Limits the category length.
});

export type SkillInput = z.infer<typeof skillSchema>;
