import { Button } from "@/components/ui/button";
import { experience } from "@/data/experience";
import { ExternalLink } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section aria-labelledby="experience-heading">
      <h3
        className="font-heading text-xl font-semibold tracking-tight"
        id="experience-heading">
        Work Experience
      </h3>
      {experience.length > 0 ? (
        <ol className="mt-6 grid gap-6">
          {experience.map((item) => (
            <li
              className="border-l-2 border-primary/30 pl-5"
              key={`${item.organization}-${item.role}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-medium">{item.role}</h4>
                <p className="text-sm text-muted-foreground">{item.period}</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.organization}
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                {item.description}
              </p>
              <p>
                {item.projects && item.projects.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.projects.map((url, index) => (
                      <Button
                        key={url}
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }>
                        View project
                        {item.projects!.length > 1 ? ` ${index + 1}` : ""}
                        <ExternalLink data-icon="inline-end" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </Button>
                    ))}
                  </div>
                )}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-muted-foreground">
          Add roles and internships to <code>data/experience.ts</code>.
        </p>
      )}
    </section>
  );
}
