import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { LoanPlayer } from "@/lib/types";
import { getInitials, formatContractDate } from "@/lib/utils";

interface LoanPlayerCardProps {
  player: LoanPlayer;
}

export function LoanPlayerCard({ player }: LoanPlayerCardProps) {
  return (
    <Card className="border-l-4 border-l-chelsea-gold border-dashed h-full">
      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-chelsea-gold/20 text-chelsea-gold text-lg font-bold">
            {getInitials(player.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{player.name}</p>
          <p className="text-xs text-muted-foreground">{player.position}</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {player.loanClub}
        </Badge>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground w-full">
          <div className="flex justify-between">
            <span>{player.nationality}</span>
            <span>{player.loanLeague}</span>
          </div>
          <div className="flex justify-between">
            <span>Until</span>
            <span>{formatContractDate(player.loanEnd)}</span>
          </div>
          {(player.appearances !== undefined || player.goals !== undefined) && (
            <div className="flex justify-between">
              {player.appearances !== undefined && (
                <span>{player.appearances} apps</span>
              )}
              {player.goals !== undefined && (
                <span>{player.goals} goals</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
