"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/features/contact/actions/send-contact-message";
import { initialContactState } from "@/features/contact/types";
import { useActionState } from "react";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialContactState,
  );

  return (
    <form
      action={formAction}
      className="rounded-xl border border-border p-6 sm:p-8">
      <h2 className="font-heading text-xl font-semibold">Send a message</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This is a UI starter. Connect a form provider or API route before
        enabling submissions.
      </p>
      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            aria-invalid={!!state.errors?.name}
            autoComplete="name"
            className="min-h-11"
            defaultValue={state.values?.name}
            id="name"
            name="name"
            placeholder="Your name"
            required
            type="text"
          />
          {state.errors?.name && (
            <p className="text-sm text-destructive" id="name-error">
              {state.errors.name[0]}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            aria-invalid={!!state.errors?.email}
            autoComplete="email"
            className="min-h-11"
            defaultValue={state.values?.email}
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
          {state.errors?.email && (
            <p className="text-sm text-destructive" id="email-error">
              {state.errors.email[0]}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            aria-describedby={
              state.errors?.message ? "message-error" : undefined
            }
            aria-invalid={!!state.errors?.message}
            className="min-h-32"
            defaultValue={state.values?.message}
            id="message"
            name="message"
            placeholder="How can I help?"
            required
          />
          {state.errors?.message && (
            <p className="text-sm text-destructive" id="message-error">
              {state.errors.message[0]}
            </p>
          )}
        </div>
        <Button disabled={isPending} type="submit">
          {isPending ? "Sending...." : "Send Message"}
        </Button>
        {state.status !== "idle" && state.message && (
          <p
            className={
              state.status === "success"
                ? "text-sm text-primary"
                : "text-sm text-destructive"
            }
            role={state.status === "error" ? "alert" : "status"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
