import type {
  Match,
  MatchesResponse,
  MatchDetailResponse,
  StandingsResponse,
} from "./types";

const API_BASE = "https://api.football-data.org/v4";
const CHELSEA_ID = 61;

function getHeaders(): HeadersInit {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key || key === "your_api_key_here") {
    return {};
  }
  return { "X-Auth-Token": key };
}

async function fetchApi<T>(
  path: string,
  revalidate: number = 60
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: getHeaders(),
      next: { revalidate },
    });
    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText} for ${path}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Fetch error for ${path}:`, error);
    return null;
  }
}

export async function getMatches(): Promise<Match[]> {
  const data = await fetchApi<MatchesResponse>(
    `/teams/${CHELSEA_ID}/matches?status=SCHEDULED,TIMED,IN_PLAY,PAUSED,FINISHED&limit=40`
  );
  return data?.matches ?? [];
}

export async function getUpcomingMatches(): Promise<Match[]> {
  const data = await fetchApi<MatchesResponse>(
    `/teams/${CHELSEA_ID}/matches?status=SCHEDULED,TIMED`
  );
  return data?.matches ?? [];
}

export async function getResults(): Promise<Match[]> {
  const data = await fetchApi<MatchesResponse>(
    `/teams/${CHELSEA_ID}/matches?status=FINISHED&limit=15`
  );
  return data?.matches ?? [];
}

export async function getMatch(id: number): Promise<MatchDetailResponse | null> {
  return fetchApi<MatchDetailResponse>(`/matches/${id}`, 30);
}

export async function getStandings(): Promise<StandingsResponse | null> {
  return fetchApi<StandingsResponse>(`/competitions/PL/standings`);
}

export function getNextMatch(matches: Match[]): Match | null {
  const now = new Date();
  const upcoming = matches
    .filter(
      (m) =>
        m.status === "SCHEDULED" ||
        m.status === "TIMED" ||
        m.status === "IN_PLAY" ||
        m.status === "PAUSED"
    )
    .sort(
      (a, b) =>
        new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    );
  return upcoming.find((m) => new Date(m.utcDate).getTime() > now.getTime() - 2 * 60 * 60 * 1000) ?? null;
}

export function getRecentForm(matches: Match[]): ("W" | "D" | "L")[] {
  const finished = matches
    .filter((m) => m.status === "FINISHED")
    .sort(
      (a, b) =>
        new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
    )
    .slice(0, 5);

  return finished.map((m) => {
    const isHome = m.homeTeam.id === CHELSEA_ID;
    if (m.score.winner === "DRAW") return "D";
    if (
      (isHome && m.score.winner === "HOME_TEAM") ||
      (!isHome && m.score.winner === "AWAY_TEAM")
    )
      return "W";
    return "L";
  });
}

export function getCompetitionFilter(matches: Match[]): string[] {
  const comps = new Set(matches.map((m) => m.competition.name));
  return Array.from(comps);
}
