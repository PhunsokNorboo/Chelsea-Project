import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { SquadMember } from "@/lib/types";
import { calculateAge, getInitials, positionLabel, formatContractDate } from "@/lib/utils";

interface PlayerCardProps {
  player: SquadMember;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link href={`/player/${player.id}`}>
      <Card className="transition-colors hover:bg-muted/50 border-l-4 border-l-chelsea-blue h-full">
        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-chelsea-blue text-white text-lg font-bold">
                {getInitials(player.name)}
              </AvatarFallback>
            </Avatar>
            {player.shirtNumber && (
              <Badge className="absolute -top-1 -right-3 bg-chelsea-gold text-chelsea-blue-dark text-xs font-bold">
                {player.shirtNumber}
              </Badge>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{player.name}</p>
            <p className="text-xs text-muted-foreground">
              {positionLabel(player.position)}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground w-full">
            <div className="flex justify-between">
              <span>{player.nationality}</span>
              <span>Age {calculateAge(player.dateOfBirth)}</span>
            </div>
            {player.contract?.until && (
              <div className="flex justify-between">
                <span>Contract</span>
                <span>{formatContractDate(player.contract.until)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
