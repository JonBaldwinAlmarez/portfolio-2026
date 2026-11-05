export type Project = {
  title: string;
  description: string;
  technologies: string[];
  href?: string;
  image: string;
};

export const projects: Project[] = [
  {
    title: "Finance Tracker",
    description:
      "A Finance tracker app that manages users financial spending over time",
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    href: "https://advance-personal-finance-tracker.netlify.app/",
    image: "/CV/image/budget-planner.png",
  },
  {
    title: "Task Tracker",
    description: "A advance task tracker that manages users task",
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    href: "https://advance-task-tracker.netlify.app/",
    image: "/CV/image/task-tracker.png",
  },
];
