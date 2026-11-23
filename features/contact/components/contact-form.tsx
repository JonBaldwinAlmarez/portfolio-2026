"use client"; // Tells Next.js to run this component on the client.
import { Button } from "@/components/ui/button"; // Imports the reusable button component.
import { Input } from "@/components/ui/input"; // Imports the reusable input component.
import { Label } from "@/components/ui/label"; // Imports the reusable form label component.
import { Textarea } from "@/components/ui/textarea"; // Imports the reusable textarea component.
import { sendContactMessage } from "@/features/contact/actions/send-contact-message"; // Imports the contact server action.
import { initialContactState } from "@/features/contact/types"; // Imports the initial form state.
import { useActionState } from "react"; // Provides form action state and pending status.

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage, // Handles the contact form submission on the server.
    initialContactState, // Initializes values, errors, and status.
  );

  return (
    <form
      action={formAction} // Sends form data through the server action.
      className="rounded-xl border border-border p-6 sm:p-8"
    >
      <h2 className="font-heading text-xl font-semibold">Send A Message</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Let's Work Together
      </p>
      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            aria-invalid={!!state.errors?.name}
            autoComplete="name" // Helps autofill the visitor's name.
            className="min-h-11" // Sets a consistent minimum field height.
            defaultValue={state.values?.name} // Preserves a submitted value after validation.
            id="name" // Associates the input with its label.
            name="name" // Sends the value to the server action.
            placeholder="Your name" // Provides an example name prompt.
            required // Prevents an empty name submission.
            type="text" // Uses a standard text input.
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
            autoComplete="email" // Helps autofill the visitor's email address.
            className="min-h-11" // Sets a consistent minimum field height.
            defaultValue={state.values?.email} // Preserves a submitted value after validation.
            id="email" // Associates the input with its label.
            name="email" // Sends the value to the server action.
            placeholder="you@example.com" // Provides an example email prompt.
            type="email" // Uses email-specific input behavior.
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
            className="min-h-32" // Gives the message field a larger height.
            defaultValue={state.values?.message} // Preserves a submitted value after validation.
            id="message" // Associates the textarea with its label.
            name="message" // Sends the value to the server action.
            placeholder="How can I help?" // Provides a prompt for the visitor.
            required // Prevents an empty message submission.
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
                ? "text-sm text-primary" // Uses primary styling for success.
                : "text-sm text-destructive" // Uses destructive styling for errors.
            }
            role={state.status === "error" ? "alert" : "status"}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
