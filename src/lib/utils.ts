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

export function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function formatContractDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function relativeTime(dateStr: string): string {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

const POSITION_GROUP_MAP: Record<string, string> = {
  "Goalkeeper": "Goalkeeper",
  "Centre-Back": "Defence",
  "Left-Back": "Defence",
  "Right-Back": "Defence",
  "Defence": "Defence",
  "Defensive Midfield": "Midfield",
  "Central Midfield": "Midfield",
  "Attacking Midfield": "Midfield",
  "Left Winger": "Midfield",
  "Right Winger": "Midfield",
  "Midfield": "Midfield",
  "Centre-Forward": "Offence",
  "Second Striker": "Offence",
  "Left Midfield": "Midfield",
  "Right Midfield": "Midfield",
  "Offence": "Offence",
};

export function mapPositionGroup(position: string | null): string {
  if (!position) return "Unknown";
  return POSITION_GROUP_MAP[position] ?? "Unknown";
}

export function positionLabel(position: string | null): string {
  if (!position) return "Unknown";
  return position;
}

export function positionGroupLabel(position: string): string {
  const map: Record<string, string> = {
    Goalkeeper: "Goalkeepers",
    Defence: "Defenders",
    Midfield: "Midfielders",
    Offence: "Forwards",
  };
  return map[position] ?? position;
}
