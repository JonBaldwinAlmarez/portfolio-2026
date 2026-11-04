import ExperienceSection from "@/features/about/experience-section";
import SkillsSection from "@/features/about/skills-section";
import {
  ConsolePrompt,
  LogEntry,
  LogHeading,
  LogModule,
} from "@/components/shared/ConsoleLog";

export default function About() {
  return (
    <section
      aria-labelledby="about-heading"
      className="scroll-mt-20 border-y border-border/70 bg-muted/30"
      id="about">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <p className="text-sm font-medium text-primary">
          <span aria-hidden className="mr-2 font-mono text-primary/60">
            &gt;_
          </span>
          About me
        </p>

        {/* Boot sequence */}
        <div className="mt-5 space-y-1.5">
          <LogEntry
            size="sm"
            time="T+00:01"
            level="Name"
            text="Jon Almarez"
            duration={0.8}
            scan={false}
          />
          <LogEntry
            size="sm"
            time="T+00:02"
            level="Course"
            text="Bachelor Of Science in Computer Engineering"
            delay={0.5}
            duration={0.8}
            scan={false}
          />
          <LogEntry
            size="sm"
            time="T+00:03"
            level="Experience"
            text="1 Year"
            delay={1}
            duration={0.8}
            scan={false}
          />
        </div>

        <LogHeading
          id="about-heading"
          className="mt-8 font-heading text-3xl font-semibold tracking-tight"
          text="Turning ideas into working software, one line of code at a time"
        />

        <div className="mt-6 space-y-5">
          <LogEntry
            time="T+00:04"
            level="INFO"
            className="max-w-3xl"
            text="I am a Computer Engineering graduate and aspiring Software Engineer with a strong passion for building modern, user-friendly, and scalable full stack web applications. I enjoy turning ideas into functional digital experiences by combining clean design, efficient code, and practical problem-solving. My primary focus is web development, particularly within the React ecosystem."
          />
          <LogEntry
            time="T+00:09"
            level="STACK"
            className="max-w-3xl"
            text="My experience includes working with technologies such as React, Next.js, TypeScript, Node.js, Express.js, MongoDB, Tailwind CSS, React Native and Laravel. Through personal projects, collaborative development, and internship experience, I have gained practical knowledge of frontend and backend development, API integration, database management, and responsive web design. I continuously explore new technologies and development practices to improve my skills and build better solutions."
            duration={1.6}
          />
          <LogEntry
            time="T+00:15"
            level="GOAL"
            className="max-w-3xl"
            text="I believe that becoming a great developer requires continuous learning, adaptability, and attention to detail. I enjoy tackling challenges, exploring different approaches, and learning from feedback. My goal is to grow as a Software Engineer, contribute to meaningful projects, collaborate with talented teams, and develop reliable applications that solve real-world problems."
          />
        </div>

        <ConsolePrompt command="load --modules experience skills" />

        {/* Experience and Skill section */}
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <LogModule command="mount experience" status="[ 800 ]">
            <ExperienceSection />
          </LogModule>
          <LogModule command="skill level" status="[ Full-Stack ]">
            <SkillsSection />
          </LogModule>
        </div>
      </div>
    </section>
  );
}
