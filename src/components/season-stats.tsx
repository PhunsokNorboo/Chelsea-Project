"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Scorer } from "@/lib/types";

interface SeasonStatsProps {
  plScorers: Scorer[];
  clScorers: Scorer[];
}

const CHELSEA_ID = 61;

interface PlayerStats {
  id: number;
  name: string;
  shirtNumber: number | null;
  goals: number;
  assists: number;
}

export function SeasonStats({ plScorers, clScorers }: SeasonStatsProps) {
  const [compFilter, setCompFilter] = useState<string>("all");

  // Filter Chelsea players from each competition
  const chelseaPl = useMemo(
    () => plScorers.filter((s) => s.team.id === CHELSEA_ID),
    [plScorers]
  );
  const chelseaCl = useMemo(
    () => clScorers.filter((s) => s.team.id === CHELSEA_ID),
    [clScorers]
  );

  // Determine which competitions have data
  const hasPlData = chelseaPl.length > 0;
  const hasClData = chelseaCl.length > 0;

  // Combine stats for "All" view
  const stats = useMemo(() => {
    const playerMap = new Map<number, PlayerStats>();

    const addScorers = (scorers: Scorer[]) => {
      for (const s of scorers) {
        if (s.team.id !== CHELSEA_ID) continue;
        const id = s.player.id;
        if (!playerMap.has(id)) {
          playerMap.set(id, {
            id,
            name: s.player.name,
            shirtNumber: s.player.shirtNumber,
            goals: 0,
            assists: 0,
          });
        }
        const player = playerMap.get(id)!;
        player.goals += s.goals;
        player.assists += s.assists ?? 0;
      }
    };

    if (compFilter === "all") {
      addScorers(plScorers);
      addScorers(clScorers);
    } else if (compFilter === "pl") {
      addScorers(plScorers);
    } else if (compFilter === "cl") {
      addScorers(clScorers);
    }

    return Array.from(playerMap.values()).sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      return b.assists - a.assists;
    });
  }, [plScorers, clScorers, compFilter]);

  if (!hasPlData && !hasClData) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Season Stats</CardTitle>
        <p className="text-sm text-muted-foreground">Chelsea scorers</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {(hasPlData && hasClData) && (
          <Tabs value={compFilter} onValueChange={setCompFilter}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-2">
                All
              </TabsTrigger>
              {hasPlData && (
                <TabsTrigger value="pl" className="text-xs px-2">
                  PL
                </TabsTrigger>
              )}
              {hasClData && (
                <TabsTrigger value="cl" className="text-xs px-2">
                  UCL
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        )}

        {stats.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No scorers yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b">
                <th className="text-left py-1.5">Player</th>
                <th className="text-center py-1.5 w-8">G</th>
                <th className="text-center py-1.5 w-8">A</th>
              </tr>
            </thead>
            <tbody>
              {stats.slice(0, 10).map((player) => (
                <tr key={player.id} className="border-b last:border-0">
                  <td className="py-1.5">
                    <div className="flex items-center gap-1.5">
                      {player.shirtNumber && (
                        <span className="text-xs text-muted-foreground w-5">
                          {player.shirtNumber}
                        </span>
                      )}
                      <span>{player.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-1.5 font-bold">{player.goals}</td>
                  <td className="text-center py-1.5">{player.assists || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
