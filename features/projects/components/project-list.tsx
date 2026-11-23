import { Card, CardDescription, CardTitle } from "@/components/ui/card"; // Imports project card layout components.
import { getPublicProjects } from "@/features/projects/queries/get-public-projects"; // Fetches published projects.
import { ProjectImage } from "./project-image"; // Imports the project image and link overlay.

export default async function ProjectList() {
  const projects = await getPublicProjects(); // Loads published projects from the database.

  if (projects.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-5 py-8 text-muted-foreground">
        No published projects yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {projects.map((project) => (
        <Card
          className="flex h-full flex-col rounded-xl border border-border p-6"
          key={project.id}
        >
          <CardTitle className="font-heading text-xl font-semibold">
            {project.title}
          </CardTitle>

          <div className="group/image relative aspect-video w-full overflow-hidden rounded-lg">
            <ProjectImage
              src={project.image}
              title={project.title}
              href={project.href ?? undefined}
              github={project.github ?? undefined}
            />
          </div>

          <CardDescription className="mt-3 flex-1 leading-7 text-muted-foreground">
            {project.description}
          </CardDescription>

          <ul
            aria-label={`${project.title} technologies`}
            className="my-5 flex flex-wrap gap-2"
          >
            {project.technologies.map((technology) => (
              <li
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                key={technology}
              >
                {technology}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </ul>
  );
}
