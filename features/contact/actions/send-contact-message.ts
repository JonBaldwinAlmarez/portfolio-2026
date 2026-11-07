"use server";

import { Resend } from "resend";
import { contactSchema } from "@/features/contact/schema/contact-schema";

/* The directive and the state type */
export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string[]>>;
  values?: { name: string; email: string; message: string };
};

export const initialContactState: ContactFormState = { status: "idle" };

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: real users never see or fill this field
  if (formData.get("company")) {
    return { status: "success", message: "Thanks! Your message was sent." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);

  /*
  Env check first. If a variable is missing you get a clear log in your terminal and
   a friendly message for the visitor, 
  instead of a cryptic crash.
    */
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");

    return {
      status: "error",
      message: "Contact form is not configured yet. Please email me directly.",
      values: raw,
    };
  }

  const resend = new Resend(apiKey);
  const { name, email, message } = parsed.data;

  /*
  replyTo: email is the key trick. The email comes from your Resend address but when user hit Reply, it goes to the visitor.
  */

  try {
    /*
    Resend returns { data, error } rather than throwing for API-level failures, so we check error. 
    The try/catch covers network failures and anything unexpected.
    */
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
        values: raw,
      };
    }

    return { status: "success", message: "Thanks! Your message was sent." };
  } catch (err) {
    console.error("Contact form failure:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
      values: raw,
    };
  }
}
