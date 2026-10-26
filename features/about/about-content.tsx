import ExperienceSection from "@/features/about/experience-section";
import SkillsSection from "@/features/about/skills-section";

export default function AboutContent() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
      <p className="text-sm font-medium text-primary">About</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Your story
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
        Replace this introduction with your biography, current focus, and the
        kind of opportunities you are interested in.
      </p>
      <div className="mt-14 grid gap-14">
        <ExperienceSection />
        <SkillsSection />
      </div>
    </div>
  );
}
