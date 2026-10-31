import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines class names and resolves Tailwind conflicts.
// Example: cn("px-2", "px-4") -> "px-4" (the last one wins)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
