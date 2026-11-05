import Link from "next/link";
import { projects } from "../types/project";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <Card
          className="flex h-full flex-col rounded-xl border border-border p-6"
          key={project.title}>
          <CardTitle className="font-heading text-xl font-semibold">
            {project.title}
          </CardTitle>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover brightness-75 grayscale transition duration-300 group-hover/card:brightness-100 group-hover/card:grayscale-0"
            />
          </div>
          <CardDescription className="mt-3 flex-1 leading-7 text-muted-foreground">
            {project.description}
          </CardDescription>
          <ul
            aria-label={`${project.title} technologies`}
            className="my-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                key={technology}>
                {technology}
              </li>
            ))}
          </ul>
          {project.href ? (
            <CardFooter>
              <Button
                className="mt-4 w-full"
                nativeButton={false}
                render={
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }>
                View project <span aria-hidden="true">→</span>
              </Button>
            </CardFooter>
          ) : null}
        </Card>
      ))}
    </ul>
  );
}
