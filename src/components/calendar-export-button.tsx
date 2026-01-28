"use client";

import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Match } from "@/lib/types";
import { generateIcsCalendar, generateIcsEvent } from "@/lib/ics";

interface CalendarExportButtonProps {
  matches: Match[];
  single?: boolean;
  label?: string;
}

export function CalendarExportButton({
  matches,
  single = false,
  label,
}: CalendarExportButtonProps) {
  function handleClick() {
    const content = single
      ? [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Chelsea FC Hub//EN",
          "CALSCALE:GREGORIAN",
          "METHOD:PUBLISH",
          generateIcsEvent(matches[0]),
          "END:VCALENDAR",
        ].join("\r\n")
      : generateIcsCalendar(matches);

    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = single
      ? `chelsea-match-${matches[0].id}.ics`
      : "chelsea-fixtures.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (matches.length === 0) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="gap-1.5"
    >
      <CalendarPlus className="h-4 w-4" />
      <span className="hidden sm:inline">{label ?? "Add to Calendar"}</span>
      <span className="sm:hidden">Calendar</span>
    </Button>
  );
}
