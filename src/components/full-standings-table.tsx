import type { StandingEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FullStandingsTableProps {
  standings: StandingEntry[];
  currentMatchday: number;
}

const CHELSEA_ID = 61;

function positionZone(position: number): string {
  if (position <= 4) return "bg-blue-500/10 dark:bg-blue-500/20";
  if (position === 5) return "bg-orange-500/10 dark:bg-orange-500/20";
  if (position === 6) return "bg-green-500/10 dark:bg-green-500/20";
  if (position >= 18) return "bg-red-500/10 dark:bg-red-500/20";
  return "";
}

function positionIndicator(position: number): string {
  if (position <= 4) return "border-l-blue-500";
  if (position === 5) return "border-l-orange-500";
  if (position === 6) return "border-l-green-500";
  if (position >= 18) return "border-l-red-500";
  return "border-l-transparent";
}

export function FullStandingsTable({
  standings,
  currentMatchday,
}: FullStandingsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Premier League Standings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Matchday {currentMatchday}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b">
                <th className="text-left py-2 pr-2 w-6">#</th>
                <th className="text-left py-2">Team</th>
                <th className="text-center py-2 w-8">P</th>
                <th className="text-center py-2 w-8">W</th>
                <th className="text-center py-2 w-8">D</th>
                <th className="text-center py-2 w-8">L</th>
                <th className="text-center py-2 w-8 hidden sm:table-cell">
                  GF
                </th>
                <th className="text-center py-2 w-8 hidden sm:table-cell">
                  GA
                </th>
                <th className="text-center py-2 w-10">GD</th>
                <th className="text-center py-2 w-10 font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((entry) => {
                const isChelsea = entry.team.id === CHELSEA_ID;

                return (
                  <tr
                    key={entry.team.id}
                    className={`border-b last:border-0 border-l-4 ${positionIndicator(
                      entry.position
                    )} ${positionZone(entry.position)} ${
                      isChelsea ? "font-semibold bg-chelsea-blue/10" : ""
                    }`}
                  >
                    <td className="py-2.5 pr-2 text-muted-foreground pl-2">
                      {entry.position}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        {entry.team.crest && (
                          <img
                            src={entry.team.crest}
                            alt=""
                            className="h-5 w-5 object-contain"
                          />
                        )}
                        <span className="hidden sm:inline">
                          {entry.team.shortName}
                        </span>
                        <span className="sm:hidden">{entry.team.tla}</span>
                      </div>
                    </td>
                    <td className="text-center py-2.5">
                      {entry.playedGames}
                    </td>
                    <td className="text-center py-2.5">{entry.won}</td>
                    <td className="text-center py-2.5">{entry.draw}</td>
                    <td className="text-center py-2.5">{entry.lost}</td>
                    <td className="text-center py-2.5 hidden sm:table-cell">
                      {entry.goalsFor}
                    </td>
                    <td className="text-center py-2.5 hidden sm:table-cell">
                      {entry.goalsAgainst}
                    </td>
                    <td className="text-center py-2.5">
                      {entry.goalDifference > 0
                        ? `+${entry.goalDifference}`
                        : entry.goalDifference}
                    </td>
                    <td className="text-center py-2.5 font-bold">
                      {entry.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-blue-500/30" />
            Champions League
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-orange-500/30" />
            Europa League
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-green-500/30" />
            Conference League
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-red-500/30" />
            Relegation
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
