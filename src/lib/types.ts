export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface Score {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration: string;
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export interface Referee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

export interface Goal {
  minute: number;
  injuryTime: number | null;
  type: string;
  team: { id: number; name: string };
  scorer: { id: number; name: string };
  assist: { id: number; name: string } | null;
}

export interface Match {
  id: number;
  utcDate: string;
  status:
    | "SCHEDULED"
    | "TIMED"
    | "IN_PLAY"
    | "PAUSED"
    | "FINISHED"
    | "POSTPONED"
    | "SUSPENDED"
    | "CANCELLED";
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  referees: Referee[];
  competition: Competition;
  venue: string | null;
  goals?: Goal[];
}

export interface MatchesResponse {
  matches: Match[];
  resultSet: {
    count: number;
    competitions: string;
    first: string;
    last: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
  };
}

export interface StandingEntry {
  position: number;
  team: Team;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface StandingsResponse {
  competition: Competition;
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
  standings: {
    stage: string;
    type: string;
    table: StandingEntry[];
  }[];
}

export interface MatchDetailResponse {
  id: number;
  utcDate: string;
  status: Match["status"];
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  goals: Goal[];
  referees: Referee[];
  competition: Competition;
  venue: string | null;
}

export type ResultType = "W" | "D" | "L";

// --- Squad / Team Detail ---

export interface SquadMember {
  id: number;
  name: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  dateOfBirth: string;
  nationality: string;
  shirtNumber: number | null;
  contract: {
    start: string | null;
    until: string | null;
  } | null;
}

export interface Coach {
  id: number;
  name: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string;
  nationality: string;
  contract: {
    start: string | null;
    until: string | null;
  } | null;
}

export interface TeamDetailResponse {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  coach: Coach;
  squad: SquadMember[];
  runningCompetitions: Competition[];
  lastUpdated: string;
}

// --- Person (Player Detail) ---

export interface PersonResponse {
  id: number;
  name: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string;
  nationality: string;
  position: string | null;
  shirtNumber: number | null;
  currentTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
    venue: string;
    runningCompetitions: Competition[];
    contract: {
      start: string | null;
      until: string | null;
    } | null;
  };
  lastUpdated: string;
}

// --- Scorers ---

export interface Scorer {
  player: {
    id: number;
    name: string;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string;
    nationality: string;
    position: string;
    shirtNumber: number | null;
  };
  team: Team;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

export interface ScorersResponse {
  count: number;
  competition: Competition;
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
  scorers: Scorer[];
}

// --- Head-to-Head ---

export interface Head2HeadAggregates {
  numberOfMatches: number;
  totalGoals: number;
  homeTeam: {
    id: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
  };
  awayTeam: {
    id: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
  };
}

export interface Head2HeadResponse {
  aggregates: Head2HeadAggregates;
  matches: Match[];
}

// --- Position History ---

export interface PositionHistoryEntry {
  matchday: number;
  position: number;
  result?: "W" | "D" | "L";
}

export interface PositionHistoryData {
  season: string;
  positions: PositionHistoryEntry[];
}

// --- Categorized News ---

export interface CategorizedNewsItem extends NewsItem {
  category: string;
}

// --- Loans (Static Data) ---

export interface LoanPlayer {
  name: string;
  position: string;
  loanClub: string;
  loanLeague: string;
  loanStart: string;
  loanEnd: string;
  nationality: string;
  shirtNumber?: number;
  appearances?: number;
  goals?: number;
}

export interface LoansData {
  lastUpdated: string;
  players: LoanPlayer[];
}

// --- News (RSS) ---

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
  imageUrl?: string;
}

// --- Curated Tweets ---

export interface CuratedTweet {
  id: string;
  category: "transfers" | "news" | "analysis" | "matchday";
  label?: string;
}

export interface CuratedTweetsData {
  lastUpdated: string;
  tweets: CuratedTweet[];
}
