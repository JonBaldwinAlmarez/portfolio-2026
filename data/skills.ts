export type Skill = {
  name: string;
  /** Short code shown inside the badge (keep it to 5 characters or less) */
  short: string;
};

export type SkillGroup = {
  category: string;
  items: Skill[];
};

export const skills: SkillGroup[] = [
  {
    category: "frontend",
    items: [
      { name: "HTML", short: "HTML" },
      { name: "CSS", short: "CSS" },
      { name: "JavaScript", short: "JS" },
      { name: "TypeScript", short: "TS" },
      { name: "React", short: "REACT" },
      { name: "Next.js", short: "NEXT" },
      { name: "Tailwind CSS", short: "TW" },
      { name: "Shadcn UI", short: "UI" },
    ],
  },
  {
    category: "backend",
    items: [
      { name: "Node.js", short: "NODE" },
      { name: "Express.js", short: "EX" },
      { name: "MongoDB", short: "MDB" },
      { name: "Mongoose", short: "MNG" },
      { name: "RESTful APIs", short: "API" },
    ],
  },
  {
    category: "tools",
    items: [
      { name: "VS Code", short: "VSC" },
      { name: "Postman", short: "PM" },
      { name: "Git", short: "GIT" },
      { name: "GitHub", short: "GH" },
    ],
  },
];
