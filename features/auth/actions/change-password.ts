"use server";

import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/features/auth/lib/verify-session";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/features/auth/schemas/change-password-schema";

export type ChangePasswordResult = {
  ok: boolean;
  message: string;
};

export async function changePassword(
  values: ChangePasswordInput,
): Promise<ChangePasswordResult> {
  const parsed = changePasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the password fields and try again.",
    };
  }

  const user = await verifySession();

  if (!user.email) {
    return {
      ok: false,
      message: "Unable to identify the signed-in account.",
    };
  }

  const supabase = await createClient();

  const { error: passwordError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (passwordError) {
    return {
      ok: false,
      message: "Your current password is incorrect.",
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) {
    return {
      ok: false,
      message: "Unable to change the password. Try again.",
    };
  }

  return {
    ok: true,
    message: "Password changed successfully.",
  };
}
