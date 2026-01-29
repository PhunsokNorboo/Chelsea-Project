import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Head2HeadResponse, Match } from "@/lib/types";

const CHELSEA_ID = 61;

function formatShortDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function calculateStats(matches: Match[]) {
  let chelseaWins = 0;
  let draws = 0;
  let opponentWins = 0;
  let opponentName = "";

  for (const match of matches) {
    if (match.status !== "FINISHED") continue;

    const chelseaIsHome = match.homeTeam.id === CHELSEA_ID;
    const opponent = chelseaIsHome ? match.awayTeam : match.homeTeam;
    if (!opponentName) opponentName = opponent.name;

    if (match.score.winner === "DRAW") {
      draws++;
    } else if (
      (chelseaIsHome && match.score.winner === "HOME_TEAM") ||
      (!chelseaIsHome && match.score.winner === "AWAY_TEAM")
    ) {
      chelseaWins++;
    } else {
      opponentWins++;
    }
  }

  return { chelseaWins, draws, opponentWins, opponentName };
}

interface HeadToHeadProps {
  data: Head2HeadResponse;
}

export function HeadToHead({ data }: HeadToHeadProps) {
  const { aggregates, matches } = data;
  if (matches.length === 0) return null;

  // Calculate stats from actual matches (more reliable than aggregates)
  const { chelseaWins, draws, opponentWins, opponentName } = calculateStats(matches);
  const total = chelseaWins + draws + opponentWins;

  const chelseaWinPct = total > 0 ? (chelseaWins / total) * 100 : 0;
  const drawPct = total > 0 ? (draws / total) * 100 : 0;
  const opponentWinPct = total > 0 ? (opponentWins / total) * 100 : 0;

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
              Chelsea {chelseaWins}
            </span>
            <span className="text-muted-foreground">
              {draws} draws
            </span>
            <span className="font-semibold">
              {opponentName} {opponentWins}
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
                    <span className="text-muted-foreground w-16 shrink-0">
                      {formatShortDate(match.utcDate)}
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
