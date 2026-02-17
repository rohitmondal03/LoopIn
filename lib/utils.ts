import { formatDuration, intervalToDuration } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeconds(totalSeconds: number) {
  const duration = intervalToDuration({
    start: 0,
    end: totalSeconds * 1000,
  });

  return formatDuration(duration);
}
