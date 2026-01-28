import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Scorer } from "@/lib/types";

interface SeasonStatsProps {
  scorers: Scorer[];
}

const CHELSEA_ID = 61;

export function SeasonStats({ scorers }: SeasonStatsProps) {
  const chelseaScorers = scorers
    .filter((s) => s.team.id === CHELSEA_ID)
    .sort((a, b) => b.goals - a.goals);

  if (chelseaScorers.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Season Stats</CardTitle>
        <p className="text-sm text-muted-foreground">
          Chelsea PL scorers
        </p>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b">
              <th className="text-left py-1.5">Player</th>
              <th className="text-center py-1.5 w-8">G</th>
              <th className="text-center py-1.5 w-8">A</th>
            </tr>
          </thead>
          <tbody>
            {chelseaScorers.map((scorer) => (
              <tr key={scorer.player.id} className="border-b last:border-0">
                <td className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    {scorer.player.shirtNumber && (
                      <span className="text-xs text-muted-foreground w-5">
                        {scorer.player.shirtNumber}
                      </span>
                    )}
                    <span>{scorer.player.name}</span>
                  </div>
                </td>
                <td className="text-center py-1.5 font-bold">
                  {scorer.goals}
                </td>
                <td className="text-center py-1.5">
                  {scorer.assists ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
