import ProjectList from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
        <p className="text-sm font-medium text-primary">Portfolio</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A selection of work, experiments, and things I have built.
        </p>
        <div className="mt-10">
          <ProjectList />
        </div>
      </section>
    </main>
  );
}
