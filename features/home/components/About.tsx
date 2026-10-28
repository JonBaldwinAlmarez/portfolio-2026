import ExperienceSection from "@/features/about/experience-section";
import SkillsSection from "@/features/about/skills-section";

export default function AboutPreview() {
  return (
    <section
      aria-labelledby="about-heading"
      className="scroll-mt-20 border-y border-border/70 bg-muted/30"
      id="about">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <p className="text-sm font-medium text-primary">About me</p>
        <h2
          className="mt-3 font-heading text-3xl font-semibold tracking-tight"
          id="about-heading">
          Turning ideas into working software, one line of code at a time
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          Hi! I’m Jon Almarez, a Computer Engineering graduate who fell in love
          with coding while exploring how websites and apps are built. Over
          time, my curiosity turned into a passion for creating web applications
          that are both functional and enjoyable to use.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          I specialize in full stack development using MERN . MongoDB,
          Express.js, React, and Node.js, I am able to develop responsive user
          interfaces, manage server-side logic, and handle database integration
          efficiently. This full-stack knowledge enables me to contribute to
          different stages of development while continuing to grow as a
          developer.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          When I’m not coding, I like learning new technologies, experimenting
          with small projects, and sharing what I learn with others in the
          community, In the past few months I started learning Python and
          Django. I also enjoy creating small IoT devices with Arduino in my
          spare time, turning ideas into fun and practical projects. I believe
          in continuous growth and love turning ideas into reality.
        </p>
        {/* Experience and Skill section */}
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <ExperienceSection />
          <SkillsSection />
        </div>
      </div>
    </section>
  );
}
