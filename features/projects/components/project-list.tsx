import Link from "next/link";
import { projects } from "../types/project";
import { ProjectImage } from "./project-image";
import Image from "next/image";
import { Code, ExternalLink } from "lucide-react";

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
          <div className="group/image relative aspect-video w-full overflow-hidden rounded-lg">
            <ProjectImage
              src={project.image}
              title={project.title}
              href={project.href}
              github={project.github}
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
        </Card>
      ))}
    </ul>
  );
}
