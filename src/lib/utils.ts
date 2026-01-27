import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMatchDate(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMatchTime(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMonthYear(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function getTimeUntil(utcDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date().getTime();
  const target = new Date(utcDate).getTime();
  const total = Math.max(0, target - now);

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total };
}

export function competitionShortName(name: string): string {
  const map: Record<string, string> = {
    "Premier League": "PL",
    "UEFA Conference League": "UECL",
    "FA Cup": "FA",
    "League Cup": "LC",
    "EFL Cup": "LC",
    "Carabao Cup": "LC",
    "UEFA Champions League": "UCL",
    "UEFA Europa League": "UEL",
    "Community Shield": "CS",
  };
  return map[name] ?? name;
}
