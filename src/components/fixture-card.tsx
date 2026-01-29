import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Match } from "@/lib/types";
import { formatMatchDate, formatMatchTime, competitionShortName } from "@/lib/utils";

const CHELSEA_ID = 61;

function getLastName(fullName: string): string {
  const parts = fullName.split(" ");
  return parts[parts.length - 1];
}

interface FixtureCardProps {
  match: Match;
}

export function FixtureCard({ match }: FixtureCardProps) {
  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isHome = match.homeTeam.id === CHELSEA_ID;

  // Group goals by team
  const homeGoals = match.goals?.filter((g) => g.team.id === match.homeTeam.id) ?? [];
  const awayGoals = match.goals?.filter((g) => g.team.id === match.awayTeam.id) ?? [];

  let resultClass = "";
  if (isFinished) {
    if (match.score.winner === "DRAW") {
      resultClass = "border-l-draw";
    } else if (
      (isHome && match.score.winner === "HOME_TEAM") ||
      (!isHome && match.score.winner === "AWAY_TEAM")
    ) {
      resultClass = "border-l-win";
    } else {
      resultClass = "border-l-loss";
    }
  }

  return (
    <Link href={`/match/${match.id}`}>
      <Card
        className={`transition-colors hover:bg-muted/50 border-l-4 ${
          isLive
            ? "border-l-red-500"
            : isFinished
              ? resultClass
              : "border-l-chelsea-blue"
        }`}
      >
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] shrink-0"
                >
                  {competitionShortName(match.competition.name)}
                </Badge>
                {isLive && (
                  <Badge variant="destructive" className="text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse mr-1" />
                    LIVE
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {match.homeTeam.crest && (
                    <img
                      src={match.homeTeam.crest}
                      alt=""
                      className="h-5 w-5 object-contain shrink-0"
                    />
                  )}
                  <span
                    className={`truncate ${
                      match.homeTeam.id === CHELSEA_ID ? "font-semibold" : ""
                    }`}
                  >
                    {match.homeTeam.shortName}
                  </span>
                </div>

                <div className="shrink-0 w-16 text-center font-mono">
                  {isFinished || isLive ? (
                    <span className="font-bold">
                      {match.score.fullTime.home} - {match.score.fullTime.away}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {formatMatchTime(match.utcDate)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                  <span
                    className={`truncate text-right ${
                      match.awayTeam.id === CHELSEA_ID ? "font-semibold" : ""
                    }`}
                  >
                    {match.awayTeam.shortName}
                  </span>
                  {match.awayTeam.crest && (
                    <img
                      src={match.awayTeam.crest}
                      alt=""
                      className="h-5 w-5 object-contain shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mt-1">
            {formatMatchDate(match.utcDate)}
          </p>

          {isFinished && (homeGoals.length > 0 || awayGoals.length > 0) && (
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {homeGoals.length > 0
                ? homeGoals
                    .map(
                      (g) =>
                        `${getLastName(g.scorer.name)} ${g.minute}'${g.type === "PENALTY" ? " (P)" : ""}${g.type === "OWN" ? " (OG)" : ""}`
                    )
                    .join(", ")
                : "—"}
              {" | "}
              {awayGoals.length > 0
                ? awayGoals
                    .map(
                      (g) =>
                        `${getLastName(g.scorer.name)} ${g.minute}'${g.type === "PENALTY" ? " (P)" : ""}${g.type === "OWN" ? " (OG)" : ""}`
                    )
                    .join(", ")
                : "—"}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
