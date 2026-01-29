"use client";

import { useState } from "react";
import type { Match } from "@/lib/types";
import { FixtureCard } from "./fixture-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear, competitionShortName } from "@/lib/utils";

interface FixturesListProps {
  matches: Match[];
  competitions: string[];
}

type FilterTab = "all" | "upcoming" | "results";

export function FixturesList({ matches, competitions }: FixturesListProps) {
  const [tab, setTab] = useState<FilterTab>("all");
  const [compFilter, setCompFilter] = useState<string>("all");

  const filtered = matches
    .filter((m) => {
      if (tab === "upcoming" && m.status === "FINISHED") return false;
      if (tab === "results" && m.status !== "FINISHED") return false;
      if (compFilter !== "all" && m.competition.name !== compFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const aTime = new Date(a.utcDate).getTime();
      const bTime = new Date(b.utcDate).getTime();
      // Results: descending (latest first), Upcoming/All: ascending (chronological)
      return tab === "results" ? bTime - aTime : aTime - bTime;
    });

  // Group by month
  const grouped = filtered.reduce<Record<string, Match[]>>((acc, match) => {
    const key = formatMonthYear(match.utcDate);
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as FilterTab)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
        </Tabs>

        {competitions.length > 1 && (
          <Tabs
            value={compFilter}
            onValueChange={setCompFilter}
          >
            <TabsList>
              <TabsTrigger value="all">All Comps</TabsTrigger>
              {competitions.map((c) => (
                <TabsTrigger key={c} value={c}>
                  {competitionShortName(c)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No matches found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, monthMatches]) => (
            <div key={month}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                {month}
              </h3>
              <div className="space-y-2">
                {monthMatches.map((match) => (
                  <FixtureCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
