import { siteConfig } from "@/config/site";

export default function ContactServices() {
  return (
    <div className="rounded-lg bg-muted/40 p-5">
      <h2 className="font-medium">Direct contact</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Replace the sample address in <code>config/site.ts</code> with your
        preferred contact email.
      </p>
      <a
        className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        href={`mailto:${siteConfig.email}`}
      >
        {siteConfig.email}
      </a>
    </div>
  );
}
