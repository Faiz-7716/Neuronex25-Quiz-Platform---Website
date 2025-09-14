import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRules(rules: string) {
  const sections = rules.split('\n\n');
  return sections.map(section => {
    const lines = section.split('\n');
    const title = lines[0].replace(':', '');
    const points = lines.slice(1).map(line => line.replace('-', '').trim());
    return { title, points };
  });
}
