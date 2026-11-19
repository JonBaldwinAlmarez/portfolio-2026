import { z } from "zod";

/*
What this does:
    Requires the current password.
    Requires an eight-character minimum for the new password.
    Checks that both password entries match.
    Prevents setting the same password again.
*/

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "New password must contain at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from the current password.",
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
