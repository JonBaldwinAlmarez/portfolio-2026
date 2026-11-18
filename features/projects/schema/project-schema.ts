import { z } from "zod";

const optionalHttpUrlSchema = z.union([
  z.literal(""),
  z
    .url()
    .refine(
      (value) => ["http:", "https:"].includes(new URL(value).protocol),
      "Enter a valid HTTP or HTTPS URL.",
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
  image: z
    .string()
    .trim()
    .min(1, "Enter an image path or URL.")
    .max(2048, "Image path or URL is too long."),
  href: optionalHttpUrlSchema,
  github: optionalHttpUrlSchema,
});

export type ProjectInput = z.infer<typeof projectSchema>;
