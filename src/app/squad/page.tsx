import { getTeam } from "@/lib/api";
import { SquadRoster } from "@/components/squad-roster";
import type { SquadMember, LoansData } from "@/lib/types";
import { getPlayerPhotos, findPlayerPhoto } from "@/lib/player-photos";
import { mapPositionGroup } from "@/lib/utils";
import loansData from "@/data/loans.json";

export const revalidate = 120;

export const metadata = {
  title: "Squad | Chelsea FC Hub",
  description: "Chelsea FC first-team squad roster and players on loan.",
};

export default async function SquadPage() {
  const [team, fplPhotos] = await Promise.all([getTeam(), getPlayerPhotos()]);
  const loans = (loansData as LoansData).players;

  const squad = team?.squad ?? [];

  // Build photo URL map keyed by player name
  const photoUrls: Record<string, string> = {};
  for (const player of squad) {
    const url = findPlayerPhoto(player.name, fplPhotos);
    if (url) photoUrls[player.name] = url;
  }
  for (const player of loans) {
    const url = findPlayerPhoto(player.name, fplPhotos);
    if (url) photoUrls[player.name] = url;
  }

  const grouped: Record<string, SquadMember[]> = {};
  for (const player of squad) {
    const pos = mapPositionGroup(player.position);
    if (!grouped[pos]) grouped[pos] = [];
    grouped[pos].push(player);
  }

  // Sort each group by shirt number
  for (const pos of Object.keys(grouped)) {
    grouped[pos].sort((a, b) => (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99));
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Squad</h1>
        {team?.coach && (
          <p className="text-muted-foreground text-sm mt-1">
            Manager: {team.coach.name}
          </p>
        )}
      </div>

      {squad.length > 0 ? (
        <SquadRoster grouped={grouped} loans={loans} photoUrls={photoUrls} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No Squad Data</h2>
          <p className="text-muted-foreground">
            Could not load squad data. Check your API key configuration.
          </p>
        </div>
      )}
    </div>
  );
}
