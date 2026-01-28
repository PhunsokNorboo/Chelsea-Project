import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrophyCardProps {
  name: string;
  count: number;
  years: number[];
  description: string;
}

export function TrophyCard({ name, count, years, description }: TrophyCardProps) {
  return (
    <Card className="border-chelsea-gold/30 bg-gradient-to-b from-chelsea-gold/5 to-transparent h-full">
      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
        <Badge className="bg-chelsea-gold text-chelsea-blue-dark text-lg font-bold px-4 py-1">
          {count}
        </Badge>
        <h3 className="font-bold text-base">{name}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
          {years.map((year) => (
            <span
              key={year}
              className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium"
            >
              {year}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
