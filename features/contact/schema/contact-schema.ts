import { z } from "zod"; // Imports Zod for runtime contact form validation.

export const contactSchema = z.object({
  name: z // Validates the visitor's name.
    .string()
    .trim() // Removes whitespace before validation.
    .min(2, "Please enter your name.") // Requires at least two characters.
    .max(100, "Name is too long."), // Limits the name length.
  email: z.string().trim().pipe(z.email("Please enter a valid email address.")), // Validates a trimmed email address.
  message: z // Validates the visitor's message.
    .string()
    .trim() // Removes whitespace before validation.
    .min(10, "Message should be at least 10 characters.") // Requires at least ten characters.
    .max(2000, "Message is too long (2000 characters max)."), // Limits the message length.
});

export type ContactInput = z.infer<typeof contactSchema>; // Defines the typed contact form values.
