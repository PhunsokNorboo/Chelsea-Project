import { Fragment } from "react";
import type { StandingEntry } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StandingsTableProps {
  standings: StandingEntry[];
  chelseaPosition: number;
}

const CHELSEA_ID = 61;

export function StandingsTable({
  standings,
  chelseaPosition,
}: StandingsTableProps) {
  // Show top 6 or include Chelsea if outside top 6
  let displayEntries = standings.slice(0, 6);
  const chelseaInTop6 = displayEntries.some((e) => e.team.id === CHELSEA_ID);

  if (!chelseaInTop6) {
    const chelseaEntry = standings.find((e) => e.team.id === CHELSEA_ID);
    if (chelseaEntry) {
      displayEntries = [...displayEntries.slice(0, 5), chelseaEntry];
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Premier League</CardTitle>
        <p className="text-sm text-muted-foreground">
          Chelsea are {getOrdinal(chelseaPosition)}
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
                <th className="text-center py-2 w-8">GD</th>
                <th className="text-center py-2 w-10 font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {displayEntries.map((entry, idx) => {
                const isChelsea = entry.team.id === CHELSEA_ID;
                const showGap =
                  !chelseaInTop6 &&
                  idx === displayEntries.length - 1 &&
                  entry.position > 6;

                return (
                  <Fragment key={entry.team.id}>
                    {showGap && (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-1 text-muted-foreground text-xs"
                        >
                          &middot;&middot;&middot;
                        </td>
                      </tr>
                    )}
                    <tr
                      className={`border-b last:border-0 ${
                        isChelsea
                          ? "bg-chelsea-blue/10 font-semibold"
                          : ""
                      }`}
                    >
                      <td className="py-2 pr-2 text-muted-foreground">
                        {entry.position}
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-1.5">
                          {entry.team.crest && (
                            <img
                              src={entry.team.crest}
                              alt=""
                              className="h-4 w-4 object-contain"
                            />
                          )}
                          <span className="hidden sm:inline">
                            {entry.team.shortName}
                          </span>
                          <span className="sm:hidden">
                            {entry.team.tla}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-2">
                        {entry.playedGames}
                      </td>
                      <td className="text-center py-2">{entry.won}</td>
                      <td className="text-center py-2">{entry.draw}</td>
                      <td className="text-center py-2">{entry.lost}</td>
                      <td className="text-center py-2">
                        {entry.goalDifference > 0
                          ? `+${entry.goalDifference}`
                          : entry.goalDifference}
                      </td>
                      <td className="text-center py-2 font-bold">
                        {entry.points}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
