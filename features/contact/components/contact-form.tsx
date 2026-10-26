import { Button } from "@/components/ui/button";

export default function ContactForm() {
  return (
    <form className="rounded-xl border border-border p-6 sm:p-8">
      <h2 className="font-heading text-xl font-semibold">Send a message</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This is a UI starter. Connect a form provider or API route before
        enabling submissions.
      </p>
      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-medium" htmlFor="name">
          Name
          <input
            autoComplete="name"
            className="min-h-11 rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled
            id="name"
            name="name"
            placeholder="Your name"
            type="text"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor="email">
          Email
          <input
            autoComplete="email"
            className="min-h-11 rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor="message">
          Message
          <textarea
            className="min-h-32 resize-y rounded-md border border-input bg-background px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled
            id="message"
            name="message"
            placeholder="How can I help?"
          />
        </label>
        <Button disabled type="submit">
          Send message
        </Button>
      </div>
    </form>
  );
}
