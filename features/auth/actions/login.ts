"use server"; // Tells Next.js to run this function on the server.

import { redirect } from "next/navigation"; // Imports redirect to navigate after login.
import { createClient } from "@/lib/supabase/server"; // Imports the server-side Supabase client.
import {
  loginSchema, // Imports the Zod schema used to validate login data.
  type LoginInput, // Imports the TypeScript type for login form values.
} from "@/features/auth/schemas/login-schema";
import type { LoginResult } from "@/features/auth/types"; // Imports the type that defines the login result.

// Handles the login process.
export async function login(
  values: LoginInput, // Receives the email and password from the form.
): Promise<LoginResult | undefined> {
  // Returns an error message or undefined if successful.

  // Validates the submitted data because TypeScript types do not check data at runtime.
  const parsed = loginSchema.safeParse(values);

  // Stops the login process if the submitted data is invalid.
  if (!parsed.success) {
    return { message: "Enter a valid email and password." }; // Returns a validation error message.
  }

  // Creates a Supabase client to communicate with Supabase.
  const supabase = await createClient();

  // Attempts to log in using the validated email and password.
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  // Checks if Supabase returned a login error.
  if (error) {
    return { message: "Invalid email or password." }; // Returns an error message if login fails.
  }

  redirect("/admin"); // Redirects the user to the admin page after successful login.
}
