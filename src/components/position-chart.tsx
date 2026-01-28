import type { PositionHistoryEntry } from "@/lib/types";

interface PositionChartProps {
  positions: PositionHistoryEntry[];
}

export function PositionChart({ positions }: PositionChartProps) {
  if (positions.length < 2) return null;

  const maxPos = 20;
  const minPos = 1;
  const range = maxPos - minPos;
  const width = 100;
  const height = 60;
  const paddingX = 4;
  const paddingY = 6;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const points = positions.map((p, i) => {
    const x = paddingX + (i / (positions.length - 1)) * innerW;
    // Position 1 = top, position 20 = bottom
    const y = paddingY + ((p.position - minPos) / range) * innerH;
    return { x, y, ...p };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];

  return (
    <div className="mt-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
        {/* Grid lines for positions 1, 5, 10, 15, 20 */}
        {[1, 5, 10, 15, 20].map((pos) => {
          const y = paddingY + ((pos - minPos) / range) * innerH;
          return (
            <g key={pos}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={0.3}
              />
              <text
                x={1}
                y={y + 1}
                fontSize={3}
                fill="currentColor"
                fillOpacity={0.3}
              >
                {pos}
              </text>
            </g>
          );
        })}

        {/* Position line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="var(--chelsea-blue)"
          strokeWidth={1}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {points.map((p) => {
          const fill =
            p.result === "W"
              ? "var(--win)"
              : p.result === "L"
                ? "var(--loss)"
                : "var(--draw)";
          return (
            <circle
              key={p.matchday}
              cx={p.x}
              cy={p.y}
              r={1.5}
              fill={fill}
            />
          );
        })}

        {/* Current position label */}
        <text
          x={last.x + 2}
          y={last.y + 1.5}
          fontSize={4}
          fontWeight="bold"
          fill="var(--chelsea-blue)"
        >
          {last.position}
        </text>
      </svg>
    </div>
  );
}
