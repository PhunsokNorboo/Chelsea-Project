import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface LegendCardProps {
  name: string;
  position: string;
  era: string;
  appearances: number;
  goals: number;
  description: string;
  image?: string;
}

export function LegendCard({
  name,
  position,
  era,
  appearances,
  goals,
  description,
  image,
}: LegendCardProps) {
  return (
    <Card className="border-l-4 border-l-chelsea-blue h-full">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 shrink-0">
            {image && (
              <AvatarImage src={image} alt={name} className="object-cover" />
            )}
            <AvatarFallback className="bg-chelsea-blue text-white text-sm font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm">{name}</h3>
                <p className="text-xs text-muted-foreground">{era}</p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                {position}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="flex gap-4 mt-auto pt-2 border-t text-xs">
          <div>
            <span className="font-bold text-chelsea-blue text-sm">{appearances}</span>
            <span className="text-muted-foreground ml-1">apps</span>
          </div>
          <div>
            <span className="font-bold text-chelsea-blue text-sm">{goals}</span>
            <span className="text-muted-foreground ml-1">goals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
