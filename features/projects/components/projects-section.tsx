import ProjectList from "@/features/projects/components/project-list";

export default function ProjectsSection() {
  return (
    <section
      aria-labelledby="projects-heading"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-16 sm:py-20"
      id="projects">
      <p className="text-sm font-medium text-primary">Portfolio</p>
      <h2
        className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
        id="projects-heading">
        Best projects
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A selection of work, experiments, and things I have built.
      </p>
      <div className="mt-8">
        <ProjectList />
      </div>
    </section>
  );
}
