import type { ResultType } from "@/lib/types";

interface FormGuideProps {
  form: ResultType[];
}

const resultConfig: Record<
  ResultType,
  { label: string; bg: string; text: string }
> = {
  W: { label: "W", bg: "bg-win", text: "text-white" },
  D: { label: "D", bg: "bg-draw", text: "text-white" },
  L: { label: "L", bg: "bg-loss", text: "text-white" },
};

export function FormGuide({ form }: FormGuideProps) {
  if (form.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Recent Form</h2>
      <div className="flex gap-2">
        {form.map((result, i) => {
          const config = resultConfig[result];
          return (
            <div
              key={i}
              className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ${config.bg} ${config.text}`}
            >
              {config.label}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Last {form.length} matches (most recent first)
      </p>
    </div>
  );
}
