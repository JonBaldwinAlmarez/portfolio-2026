import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  return (
    <form className="rounded-xl border border-border p-6 sm:p-8">
      <h2 className="font-heading text-xl font-semibold">Send a message</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This is a UI starter. Connect a form provider or API route before
        enabling submissions.
      </p>
      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            autoComplete="name"
            className="min-h-11"
            disabled
            id="name"
            name="name"
            placeholder="Your name"
            type="text"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            autoComplete="email"
            className="min-h-11"
            disabled
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            className="min-h-32"
            disabled
            id="message"
            name="message"
            placeholder="How can I help?"
          />
        </div>
        <Button disabled type="submit">
          Send message
        </Button>
      </div>
    </form>
  );
}
