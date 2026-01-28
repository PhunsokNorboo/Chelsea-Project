import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getPerson, getScorers } from "@/lib/api";
import { getPlayerPhotos, findPlayerPhoto } from "@/lib/player-photos";
import {
  calculateAge,
  getInitials,
  formatContractDate,
  positionLabel,
} from "@/lib/utils";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;
  const personId = parseInt(id, 10);
  if (isNaN(personId)) notFound();

  const [person, scorersData, fplPhotos] = await Promise.all([
    getPerson(personId),
    getScorers(),
    getPlayerPhotos(),
  ]);

  if (!person) notFound();

  const photoUrl = findPlayerPhoto(person.name, fplPhotos);

  const chelseaScorer = scorersData?.scorers.find(
    (s) => s.player.id === personId && s.team.id === 61
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link
        href="/squad"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Squad
      </Link>

      <Card>
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <Avatar className="h-24 w-24 mb-3">
            {photoUrl && (
              <AvatarImage src={photoUrl} alt={person.name} />
            )}
            <AvatarFallback className="bg-chelsea-blue text-white text-2xl font-bold">
              {getInitials(person.name)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{person.name}</h1>
          <div className="flex gap-2 mt-2">
            {person.position && (
              <Badge variant="secondary">
                {positionLabel(person.position)}
              </Badge>
            )}
            {person.shirtNumber && (
              <Badge className="bg-chelsea-gold text-chelsea-blue-dark">
                #{person.shirtNumber}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                Nationality
              </p>
              <p className="font-medium">{person.nationality}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                Age
              </p>
              <p className="font-medium">{calculateAge(person.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                Date of Birth
              </p>
              <p className="font-medium">
                {new Date(person.dateOfBirth).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {person.currentTeam?.venue && (
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                  Stadium
                </p>
                <p className="font-medium">{person.currentTeam.venue}</p>
              </div>
            )}
          </div>

          {person.currentTeam?.contract && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="font-semibold mb-3">Contract</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                      Start
                    </p>
                    <p className="font-medium">
                      {formatContractDate(person.currentTeam.contract.start)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                      Until
                    </p>
                    <p className="font-medium">
                      {formatContractDate(person.currentTeam.contract.until)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {chelseaScorer && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="font-semibold mb-3">Premier League Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chelsea-blue">
                      {chelseaScorer.goals}
                    </p>
                    <p className="text-xs text-muted-foreground">Goals</p>
                  </div>
                  {chelseaScorer.assists !== null && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-chelsea-blue">
                        {chelseaScorer.assists}
                      </p>
                      <p className="text-xs text-muted-foreground">Assists</p>
                    </div>
                  )}
                  {chelseaScorer.penalties !== null && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-chelsea-blue">
                        {chelseaScorer.penalties}
                      </p>
                      <p className="text-xs text-muted-foreground">Penalties</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {person.currentTeam?.runningCompetitions &&
            person.currentTeam.runningCompetitions.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold mb-3">Competitions</h3>
                  <div className="flex flex-wrap gap-2">
                    {person.currentTeam.runningCompetitions.map((comp) => (
                      <Badge key={comp.id} variant="outline">
                        {comp.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
