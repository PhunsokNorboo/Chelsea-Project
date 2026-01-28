import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamDetailResponse } from "@/lib/types";

interface ClubInfoProps {
  team: TeamDetailResponse;
}

export function ClubInfo({ team }: ClubInfoProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {team.crest && (
            <img
              src={team.crest}
              alt={team.name}
              className="h-6 w-6 object-contain"
            />
          )}
          {team.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Founded</span>
            <span className="font-medium">{team.founded}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stadium</span>
            <span className="font-medium">{team.venue}</span>
          </div>
          {team.coach && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Manager</span>
              <span className="font-medium">{team.coach.name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Colors</span>
            <span className="font-medium">{team.clubColors}</span>
          </div>
          {team.address && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-right text-xs max-w-[60%]">
                {team.address}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
