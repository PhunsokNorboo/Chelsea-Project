import type { Match } from "./types";

function formatIcsDate(utcDate: string): string {
  return new Date(utcDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function addHours(utcDate: string, hours: number): string {
  const d = new Date(utcDate);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function escapeIcs(text: string): string {
  return text.replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export function generateIcsEvent(match: Match): string {
  const home = match.homeTeam.shortName || match.homeTeam.name;
  const away = match.awayTeam.shortName || match.awayTeam.name;
  const summary = `${home} vs ${away}`;
  const description = `${match.competition.name}${match.matchday ? ` — Matchday ${match.matchday}` : ""}`;
  const location = match.venue || "";

  const lines = [
    "BEGIN:VEVENT",
    `DTSTART:${formatIcsDate(match.utcDate)}`,
    `DTEND:${formatIcsDate(addHours(match.utcDate, 2))}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    location ? `LOCATION:${escapeIcs(location)}` : "",
    `UID:match-${match.id}@chelseafchub`,
    `STATUS:CONFIRMED`,
    "END:VEVENT",
  ];

  return lines.filter(Boolean).join("\r\n");
}

export function generateIcsCalendar(matches: Match[]): string {
  const events = matches.map(generateIcsEvent).join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Chelsea FC Hub//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Chelsea FC Fixtures",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}
