"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";
import { getTimeUntil, formatMatchDate, formatMatchTime } from "@/lib/utils";

interface CountdownProps {
  match: Match;
}

export function Countdown({ match }: CountdownProps) {
  const [time, setTime] = useState(getTimeUntil(match.utcDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntil(match.utcDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [match.utcDate]);

  const isLive =
    match.status === "IN_PLAY" || match.status === "PAUSED";

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-chelsea-blue to-chelsea-blue-dark p-6 md:p-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent)]" />
      <div className="relative">
        <p className="text-chelsea-gold font-semibold text-sm uppercase tracking-wider mb-1">
          {isLive ? "Live Now" : "Next Match"}
        </p>
        <p className="text-xs text-white/70 mb-4">
          {match.competition.name}
          {match.matchday ? ` — Matchday ${match.matchday}` : ""}
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
          <div className="text-center flex-1">
            {match.homeTeam.crest && (
              <img
                src={match.homeTeam.crest}
                alt={match.homeTeam.shortName}
                className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-2 object-contain"
              />
            )}
            <p className="font-bold text-sm md:text-base">
              {match.homeTeam.shortName}
            </p>
          </div>

          <div className="text-center shrink-0">
            {isLive ? (
              <div>
                <div className="text-3xl md:text-4xl font-bold">
                  {match.score.fullTime.home} - {match.score.fullTime.away}
                </div>
                <div className="flex items-center gap-1 mt-1 justify-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs uppercase font-semibold text-red-300">
                    Live
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-lg md:text-xl font-semibold text-white/60">
                vs
              </p>
            )}
          </div>

          <div className="text-center flex-1">
            {match.awayTeam.crest && (
              <img
                src={match.awayTeam.crest}
                alt={match.awayTeam.shortName}
                className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-2 object-contain"
              />
            )}
            <p className="font-bold text-sm md:text-base">
              {match.awayTeam.shortName}
            </p>
          </div>
        </div>

        {!isLive && (
          <>
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-4">
              {[
                { label: "Days", value: time.days },
                { label: "Hrs", value: time.hours },
                { label: "Min", value: time.minutes },
                { label: "Sec", value: time.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="bg-white/10 rounded-lg p-2 text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/60">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-white/60">
              {formatMatchDate(match.utcDate)} &middot;{" "}
              {formatMatchTime(match.utcDate)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
