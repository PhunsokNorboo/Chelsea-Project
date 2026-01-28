import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Head2HeadResponse } from "@/lib/types";
import { formatMatchDate } from "@/lib/utils";

const CHELSEA_ID = 61;

interface HeadToHeadProps {
  data: Head2HeadResponse;
}

export function HeadToHead({ data }: HeadToHeadProps) {
  const { aggregates, matches } = data;
  if (aggregates.numberOfMatches === 0) return null;

  // Determine Chelsea's perspective
  const chelseaIsHome = aggregates.homeTeam.id === CHELSEA_ID;
  const chelseaStats = chelseaIsHome
    ? aggregates.homeTeam
    : aggregates.awayTeam;
  const opponentStats = chelseaIsHome
    ? aggregates.awayTeam
    : aggregates.homeTeam;

  const total = aggregates.numberOfMatches;
  const chelseaWinPct = (chelseaStats.wins / total) * 100;
  const drawPct = (chelseaStats.draws / total) * 100;
  const opponentWinPct = (opponentStats.wins / total) * 100;

  // Recent encounters (last 5)
  const recent = matches.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Head-to-Head</CardTitle>
        <p className="text-sm text-muted-foreground">
          {aggregates.numberOfMatches} meetings, {aggregates.totalGoals} total
          goals
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold">
              Chelsea {chelseaStats.wins}
            </span>
            <span className="text-muted-foreground">
              {chelseaStats.draws} draws
            </span>
            <span className="font-semibold">
              {opponentStats.name} {opponentStats.wins}
            </span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden">
            {chelseaWinPct > 0 && (
              <div
                className="bg-win transition-all"
                style={{ width: `${chelseaWinPct}%` }}
              />
            )}
            {drawPct > 0 && (
              <div
                className="bg-draw transition-all"
                style={{ width: `${drawPct}%` }}
              />
            )}
            {opponentWinPct > 0 && (
              <div
                className="bg-loss transition-all"
                style={{ width: `${opponentWinPct}%` }}
              />
            )}
          </div>
        </div>

        {/* Recent encounters */}
        {recent.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Recent Encounters
            </p>
            <div className="space-y-1.5">
              {recent.map((match) => {
                const homeScore = match.score.fullTime.home;
                const awayScore = match.score.fullTime.away;
                const isFinished = match.status === "FINISHED";

                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b last:border-0"
                  >
                    <span className="text-muted-foreground w-20 shrink-0">
                      {formatMatchDate(match.utcDate).split(",")[0]}
                    </span>
                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <span
                        className={
                          match.homeTeam.id === CHELSEA_ID
                            ? "font-semibold"
                            : ""
                        }
                      >
                        {match.homeTeam.shortName || match.homeTeam.tla}
                      </span>
                      {isFinished ? (
                        <span className="font-bold bg-muted px-2 py-0.5 rounded text-xs">
                          {homeScore} - {awayScore}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">vs</span>
                      )}
                      <span
                        className={
                          match.awayTeam.id === CHELSEA_ID
                            ? "font-semibold"
                            : ""
                        }
                      >
                        {match.awayTeam.shortName || match.awayTeam.tla}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
