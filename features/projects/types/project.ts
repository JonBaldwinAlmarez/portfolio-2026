import type { Project } from "@/features/projects/types/project";

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
    description: "Your real description here.",
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    href: "https://advance-personal-finance-tracker.netlify.app/",
    image: "/CV/image/budget-planner.png",
  },
  {
    title: "Task Tracker",
    description: "Your real description here.",
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    href: "https://advance-task-tracker.netlify.app/",
    image: "/CV/image/task-tracker.png",
  },
];
