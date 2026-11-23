import { z } from "zod"; // Imports Zod for runtime project form validation.

// Validates project URLs as trimmed HTTP or HTTPS links.
const httpUrlSchema = z
  .string()
  .trim() // Removes surrounding whitespace.
  .pipe(z.url()) // Checks that the value is a valid URL.
  .refine(
    (value) => /^https?:\/\//i.test(value),
    "Enter a valid HTTP or HTTPS URL.", // Returns an error for unsupported URL protocols.
  );

// Accepts an uploaded image URL or a root-relative image path.
const imageSchema = z.union([
  httpUrlSchema, // Allows an HTTP or HTTPS image URL.
  z
    .string()
    .trim() // Removes surrounding whitespace.
    .min(1, "Choose a project image.") // Requires an image value.
    .max(2048, "Image path or URL is too long.") // Limits image paths and URLs.
    .refine(
      (value) => value.startsWith("/") && !value.startsWith("//"),
      "Use an uploaded image URL or a root-relative image path.", // Rejects protocol-relative external paths.
    ),
]);

// Defines the validated project data used by server actions.
export const projectSchema = z.object({
  title: z // Validates the project title.
    .string()
    .trim() // Removes surrounding whitespace.
    .min(1, "Enter a project title.") // Requires a title.
    .max(100, "Title is too long (100 characters max)."), // Limits title length.
  description: z // Validates the project description.
    .string()
    .trim() // Removes surrounding whitespace.
    .min(1, "Enter a project description.") // Requires a description.
    .max(2000, "Description is too long (2000 characters max)."), // Limits description length.
  technologies: z // Validates the technology list.
    .string()
    .trim() // Removes surrounding whitespace.
    .min(1, "Enter at least one technology.") // Requires at least one technology.
    .max(500, "Technologies are too long.") // Limits the combined technology text.
    .refine((value) => {
      const items = value
        .split(/[,\n]/) // Splits technologies by commas or line breaks.
        .map((item) => item.trim()) // Removes whitespace from each technology.
        .filter(Boolean); // Removes empty entries.

      return (
        items.length > 0 &&
        items.length <= 20 &&
        items.every((item) => item.length <= 60)
      );
    }, "Enter up to 20 technologies, separated by commas or new lines. Each must be 60 characters or fewer."), // Limits count and item length.
  image: imageSchema, // Validates the project image.
  href: httpUrlSchema, // Validates the live project URL.
  github: httpUrlSchema, // Validates the GitHub repository URL.
});

// Extends server validation so an existing image can remain empty in the form.
export const projectFormSchema = projectSchema.extend({
  image: z.union([imageSchema, z.literal("")]), // Allows an empty image field before selection or upload.
});

export type ProjectInput = z.infer<typeof projectSchema>; // Defines typed validated project values.
export type ProjectFormValues = z.infer<typeof projectFormSchema>; // Defines typed project form values.
