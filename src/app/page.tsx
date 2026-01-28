import { Countdown } from "@/components/countdown";
import { FixturesList } from "@/components/fixtures-list";
import { FormGuide } from "@/components/form-guide";
import { StandingsTable } from "@/components/standings-table";
import { ClubInfo } from "@/components/club-info";
import { SeasonStats } from "@/components/season-stats";
import { CalendarExportButton } from "@/components/calendar-export-button";
import { SeasonProgress } from "@/components/season-progress";
import type { PositionHistoryData } from "@/lib/types";
import positionHistoryData from "@/data/position-history.json";
import {
  getMatches,
  getStandings,
  getTeam,
  getScorers,
  getNextMatch,
  getRecentForm,
  getCompetitionFilter,
} from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
  const [matches, standingsData, team, scorersData] = await Promise.all([
    getMatches(),
    getStandings(),
    getTeam(),
    getScorers(),
  ]);

  const nextMatch = getNextMatch(matches);
  const form = getRecentForm(matches);
  const competitions = getCompetitionFilter(matches);
  const upcomingMatches = matches.filter(
    (m) => m.status === "SCHEDULED" || m.status === "TIMED"
  );

  const plStandings =
    standingsData?.standings?.find((s) => s.type === "TOTAL")?.table ?? [];
  const chelseaEntry = plStandings.find((e) => e.team.id === 61);
  const chelseaPosition = chelseaEntry?.position ?? 0;

  const scorers = scorersData?.scorers ?? [];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {nextMatch && <Countdown match={nextMatch} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Fixtures & Results</h2>
              <CalendarExportButton matches={upcomingMatches} />
            </div>
            <FixturesList matches={matches} competitions={competitions} />
          </section>
        </div>

        <aside className="space-y-6">
          {form.length > 0 && <FormGuide form={form} />}

          <SeasonProgress data={positionHistoryData as PositionHistoryData} />

          {plStandings.length > 0 && (
            <StandingsTable
              standings={plStandings}
              chelseaPosition={chelseaPosition}
            />
          )}

          <SeasonStats scorers={scorers} />

          {team && <ClubInfo team={team} />}
        </aside>
      </div>

      {matches.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">
            Set your <code className="bg-muted px-1 rounded">FOOTBALL_DATA_API_KEY</code> in{" "}
            <code className="bg-muted px-1 rounded">.env.local</code> to load fixtures from
            football-data.org.
          </p>
        </div>
      )}
    </div>
  );
}
