import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PositionChart } from "./position-chart";
import type { PositionHistoryData } from "@/lib/types";

interface SeasonProgressProps {
  data: PositionHistoryData;
}

export function SeasonProgress({ data }: SeasonProgressProps) {
  const { positions } = data;
  if (positions.length === 0) return null;

  const current = positions[positions.length - 1];
  const wins = positions.filter((p) => p.result === "W").length;
  const draws = positions.filter((p) => p.result === "D").length;
  const losses = positions.filter((p) => p.result === "L").length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Season Progress</CardTitle>
        <p className="text-sm text-muted-foreground">
          {data.season} &middot; Matchday {current.matchday}
        </p>
      </CardHeader>
      <CardContent>
        {/* Results dots */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {positions.map((p) => (
            <div
              key={p.matchday}
              className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                p.result === "W"
                  ? "bg-win"
                  : p.result === "L"
                    ? "bg-loss"
                    : "bg-draw"
              }`}
              title={`MD${p.matchday}: ${p.result} (${p.position}th)`}
            >
              {p.result}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{wins}W {draws}D {losses}L</span>
          <span className="font-semibold text-foreground">
            Position: {current.position}
          </span>
        </div>

        {/* Position chart */}
        <PositionChart positions={positions} />
      </CardContent>
    </Card>
  );
}
