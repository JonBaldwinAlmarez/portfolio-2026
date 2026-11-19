import { siteConfig } from "@/config/site";

export default function ContactServices() {
  return (
    <div className="rounded-lg bg-muted/40 p-5">
      <h2 className="font-medium">Direct contact</h2>

      <a
        className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        href={`mailto:${siteConfig.email}`}>
        {siteConfig.email}
      </a>
    </div>
  );
}
