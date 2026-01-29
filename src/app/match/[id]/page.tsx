import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMatch, getHead2Head } from "@/lib/api";
import { HeadToHead } from "@/components/head-to-head";
import { MatchTimeline } from "@/components/match-timeline";
import { CalendarExportButton } from "@/components/calendar-export-button";
import { LiveMatchWrapper } from "@/components/live-match-wrapper";
import {
  formatMatchDate,
  formatMatchTime,
  competitionShortName,
} from "@/lib/utils";
import type { MatchDetailResponse } from "@/lib/types";

export const revalidate = 30;

interface PageProps {
  params: Promise<{ id: string }>;
}

function MatchContent({ match }: { match: MatchDetailResponse }) {
  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isUpcoming =
    match.status === "SCHEDULED" || match.status === "TIMED";

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge variant="secondary">
            {competitionShortName(match.competition.name)}
          </Badge>
          {match.matchday && (
            <Badge variant="outline">Matchday {match.matchday}</Badge>
          )}
          {isLive && (
            <Badge variant="destructive">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse mr-1" />
              LIVE
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatMatchDate(match.utcDate)} &middot;{" "}
          {formatMatchTime(match.utcDate)}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-center gap-6 md:gap-10 py-4">
          <div className="text-center flex-1">
            {match.homeTeam.crest && (
              <img
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-2 object-contain"
              />
            )}
            <p className="font-bold text-sm md:text-base">
              {match.homeTeam.name}
            </p>
          </div>

          <div className="text-center shrink-0">
            {isFinished || isLive ? (
              <div className="text-4xl md:text-5xl font-bold tabular-nums">
                {match.score.fullTime.home} - {match.score.fullTime.away}
              </div>
            ) : (
              <div className="text-2xl font-semibold text-muted-foreground">
                vs
              </div>
            )}
            {match.score.halfTime.home !== null && (
              <p className="text-xs text-muted-foreground mt-1">
                HT: {match.score.halfTime.home} - {match.score.halfTime.away}
              </p>
            )}
          </div>

          <div className="text-center flex-1">
            {match.awayTeam.crest && (
              <img
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-2 object-contain"
              />
            )}
            <p className="font-bold text-sm md:text-base">
              {match.awayTeam.name}
            </p>
          </div>
        </div>

        {/* Goals section */}
        {isFinished && (
          <>
            <Separator className="my-4" />
            {match.goals && match.goals.length > 0 ? (
              <>
                <MatchTimeline
                  goals={match.goals}
                  homeTeamId={match.homeTeam.id}
                />
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold mb-3">Goals</h3>
                  <div className="space-y-2">
                    {match.goals.map((goal, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{goal.scorer.name}</span>
                          {goal.assist && (
                            <span className="text-muted-foreground text-xs">
                              (ast. {goal.assist.name})
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {goal.minute}&apos;
                          {goal.injuryTime ? `+${goal.injuryTime}` : ""}
                          {goal.type === "OWN" && " (OG)"}
                          {goal.type === "PENALTY" && " (P)"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                Goal details not available on free API tier
              </p>
            )}
          </>
        )}

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          {match.venue && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                Venue
              </p>
              <p className="font-medium">{match.venue}</p>
            </div>
          )}
          {match.referees.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                Referee
              </p>
              <p className="font-medium">{match.referees[0].name}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
              Competition
            </p>
            <p className="font-medium">{match.competition.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
              Status
            </p>
            <p className="font-medium capitalize">
              {match.status.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>

        {/* Calendar export for upcoming matches */}
        {isUpcoming && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-center">
              <CalendarExportButton
                matches={[match as unknown as import("@/lib/types").Match]}
                single
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const matchId = parseInt(id, 10);
  if (isNaN(matchId)) notFound();

  const [match, h2h] = await Promise.all([
    getMatch(matchId),
    getHead2Head(matchId, 10),
  ]);
  if (!match) notFound();

  // Debug: log goals data
  console.log(`Match ${matchId} goals:`, match.goals);

  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Fixtures
      </Link>

      {isLive ? (
        <LiveMatchWrapper
          matchId={matchId}
          initialData={match}
          isLive={isLive}
        >
          {(data) => <MatchContent match={data} />}
        </LiveMatchWrapper>
      ) : (
        <MatchContent match={match} />
      )}

      {h2h && <HeadToHead data={h2h} />}
    </div>
  );
}
