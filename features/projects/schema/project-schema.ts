import { z } from "zod";

const httpUrlSchema = z
  .string()
  .trim()
  .pipe(z.url())
  .refine(
    (value) => /^https?:\/\//i.test(value),
    "Enter a valid HTTP or HTTPS URL.",
  );

const imageSchema = z.union([
  httpUrlSchema,
  z
    .string()
    .trim()
    .min(1, "Choose a project image.")
    .max(2048, "Image path or URL is too long.")
    .refine(
      (value) => value.startsWith("/") && !value.startsWith("//"),
      "Use an uploaded image URL or a root-relative image path.",
    ),
]);

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a project title.")
    .max(100, "Title is too long (100 characters max)."),
  description: z
    .string()
    .trim()
    .min(1, "Enter a project description.")
    .max(2000, "Description is too long (2000 characters max)."),
  technologies: z
    .string()
    .trim()
    .min(1, "Enter at least one technology.")
    .max(500, "Technologies are too long.")
    .refine((value) => {
      const items = value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean);

      return (
        items.length > 0 &&
        items.length <= 20 &&
        items.every((item) => item.length <= 60)
      );
    }, "Enter up to 20 technologies, separated by commas or new lines. Each must be 60 characters or fewer."),
  image: imageSchema,
  href: httpUrlSchema,
  github: httpUrlSchema,
});

export const projectFormSchema = projectSchema.extend({
  image: z.union([imageSchema, z.literal("")]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
