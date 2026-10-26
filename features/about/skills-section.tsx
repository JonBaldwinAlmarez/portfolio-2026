import { skills } from "@/data/skills";

export default function SkillsSection() {
  return (
    <section aria-labelledby="skills-heading">
      <h3
        className="font-heading text-xl font-semibold tracking-tight"
        id="skills-heading"
      >
        Skills
      </h3>
      {skills.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm"
              key={skill}
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted-foreground">
          Add your skills to <code>data/skills.ts</code>.
        </p>
      )}
    </section>
  );
}
