import Link from "next/link";
import { projects } from "@/data/projects";

export default function ProjectList() {
  if (projects.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-5 py-8 text-muted-foreground">
        Add project entries to <code>data/projects.ts</code> to display your
        work here.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {projects.map((project) => (
        <li
          className="flex h-full flex-col rounded-xl border border-border p-6"
          key={project.title}>
          <h3 className="font-heading text-xl font-semibold">
            {project.title}
          </h3>
          <p className="mt-3 flex-1 leading-7 text-muted-foreground">
            {project.description}
          </p>
          <ul
            aria-label={`${project.title} technologies`}
            className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                key={technology}>
                {technology}
              </li>
            ))}
          </ul>
          {project.href ? (
            <Link
              className="mt-5 text-sm font-medium text-primary underline-offset-4 hover:underline"
              href={project.href}>
              View project <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
