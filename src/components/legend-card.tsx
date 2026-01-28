import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LegendCardProps {
  name: string;
  position: string;
  era: string;
  appearances: number;
  goals: number;
  description: string;
}

export function LegendCard({
  name,
  position,
  era,
  appearances,
  goals,
  description,
}: LegendCardProps) {
  return (
    <Card className="border-l-4 border-l-chelsea-blue h-full">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{era}</p>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {position}
          </Badge>
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
