import { getStandings } from "@/lib/api";
import { FullStandingsTable } from "@/components/full-standings-table";

export const revalidate = 60;

export const metadata = {
  title: "Standings | Chelsea FC Hub",
  description: "Full Premier League standings table.",
};

export default async function StandingsPage() {
  const data = await getStandings();

  const standings =
    data?.standings?.find((s) => s.type === "TOTAL")?.table ?? [];
  const currentMatchday = data?.season?.currentMatchday ?? 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {standings.length > 0 ? (
        <FullStandingsTable
          standings={standings}
          currentMatchday={currentMatchday}
        />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No Standings Data</h2>
          <p className="text-muted-foreground">
            Could not load Premier League standings.
          </p>
        </div>
      )}
    </div>
  );
}
