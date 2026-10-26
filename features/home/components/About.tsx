import ExperienceSection from "@/features/about/experience-section";
import SkillsSection from "@/features/about/skills-section";

export default function AboutPreview() {
  return (
    <section
      aria-labelledby="about-heading"
      className="scroll-mt-20 border-y border-border/70 bg-muted/30"
      id="about"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <p className="text-sm font-medium text-primary">About</p>
        <h2
          className="mt-3 font-heading text-3xl font-semibold tracking-tight"
          id="about-heading"
        >
          Your story
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          Replace this introduction with your biography, current focus, and the
          kind of opportunities you are interested in.
        </p>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <ExperienceSection />
          <SkillsSection />
        </div>
      </div>
    </section>
  );
}
