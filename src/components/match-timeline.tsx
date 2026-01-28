import type { Goal } from "@/lib/types";

const CHELSEA_ID = 61;

interface MatchTimelineProps {
  goals: Goal[];
  homeTeamId: number;
}

export function MatchTimeline({ goals, homeTeamId }: MatchTimelineProps) {
  if (goals.length === 0) return null;

  const maxMinute = Math.max(90, ...goals.map((g) => g.minute + (g.injuryTime ?? 0)));

  return (
    <div className="py-2">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Match Timeline
      </p>
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-muted rounded-full relative">
          {/* Half-time marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-border"
            style={{ left: `${(45 / maxMinute) * 100}%` }}
          />
          {/* Full-time marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-border"
            style={{ left: `${(90 / maxMinute) * 100}%` }}
          />
        </div>

        {/* Goal markers */}
        {goals.map((goal, i) => {
          const minute = goal.minute + (goal.injuryTime ?? 0);
          const pct = (minute / maxMinute) * 100;
          const isChelsea = goal.team.id === CHELSEA_ID;
          const isHome = goal.team.id === homeTeamId;

          return (
            <div
              key={i}
              className="absolute"
              style={{ left: `${pct}%`, top: isHome ? "-20px" : "14px" }}
            >
              <div className="flex flex-col items-center -translate-x-1/2">
                {isHome ? (
                  <>
                    <span
                      className={`text-[10px] leading-tight whitespace-nowrap ${isChelsea ? "font-bold" : "text-muted-foreground"}`}
                    >
                      {goal.scorer.name.split(" ").pop()} {minute}&apos;
                      {goal.type === "PENALTY" ? " (P)" : ""}
                      {goal.type === "OWN" ? " (OG)" : ""}
                    </span>
                    <div
                      className={`h-2 w-2 rounded-full mt-0.5 ${isChelsea ? "bg-chelsea-blue" : "bg-muted-foreground"}`}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className={`h-2 w-2 rounded-full mb-0.5 ${isChelsea ? "bg-chelsea-blue" : "bg-muted-foreground"}`}
                    />
                    <span
                      className={`text-[10px] leading-tight whitespace-nowrap ${isChelsea ? "font-bold" : "text-muted-foreground"}`}
                    >
                      {goal.scorer.name.split(" ").pop()} {minute}&apos;
                      {goal.type === "PENALTY" ? " (P)" : ""}
                      {goal.type === "OWN" ? " (OG)" : ""}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Time labels */}
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
          <span>0&apos;</span>
          <span>45&apos;</span>
          <span>90&apos;</span>
        </div>
      </div>
    </div>
  );
}
