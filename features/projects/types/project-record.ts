export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  href: string | null;
  image: string;
  github: string | null;
  sort_order: number;
  created_at: string;
};
