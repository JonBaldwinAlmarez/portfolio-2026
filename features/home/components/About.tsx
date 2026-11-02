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
          I am a Computer Engineering graduate and aspiring Software Engineer
          with a strong passion for building modern, user-friendly, and scalable
          full stack web applications. I enjoy turning ideas into functional
          digital experiences by combining clean design, efficient code, and
          practical problem-solving. My primary focus is web development,
          particularly within the React ecosystem.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          My experience includes working with technologies such as React,
          Next.js, TypeScript, Node.js, Express.js, MongoDB, Tailwind CSS, React
          Native and Laravel. Through personal projects, collaborative
          development, and internship experience, I have gained practical
          knowledge of frontend and backend development, API integration,
          database management, and responsive web design. I continuously explore
          new technologies and development practices to improve my skills and
          build better solutions.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          I believe that becoming a great developer requires continuous
          learning, adaptability, and attention to detail. I enjoy tackling
          challenges, exploring different approaches, and learning from
          feedback. My goal is to grow as a Software Engineer, contribute to
          meaningful projects, collaborate with talented teams, and develop
          reliable applications that solve real-world problems.
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
