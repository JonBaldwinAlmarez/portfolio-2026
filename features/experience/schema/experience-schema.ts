import { z } from "zod";

export const experienceSchema = z.object({
  position: z.string().trim().min(1).max(100),
  hours: z.coerce.number().int().min(1),
  company: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(2000),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
