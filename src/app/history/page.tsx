import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrophyCard } from "@/components/trophy-card";
import { LegendCard } from "@/components/legend-card";
import historyData from "@/data/history.json";

export const metadata = {
  title: "History | Chelsea FC Hub",
  description:
    "Chelsea FC trophy cabinet, legendary players, club records, and historic milestones.",
};

export default function HistoryPage() {
  const { trophies, legends, records, milestones } = historyData;

  const totalTrophies = trophies.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero banner */}
      <div className="rounded-xl bg-gradient-to-br from-chelsea-blue to-chelsea-blue-dark text-white p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Club History</h1>
        <p className="text-white/80 text-sm">
          Founded in 1905. {totalTrophies} major honours and counting.
        </p>
      </div>

      {/* Trophy Cabinet */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Trophy Cabinet</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trophies.map((trophy) => (
            <TrophyCard key={trophy.name} {...trophy} />
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Legends */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Club Legends</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {legends.map((legend) => (
            <LegendCard key={legend.name} {...legend} />
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Records */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Club Records</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs border-b">
                    <th className="text-left py-3 px-4">Record</th>
                    <th className="text-left py-3 px-4">Value</th>
                    <th className="text-left py-3 px-4">Holder</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.type} className="border-b last:border-0">
                      <td className="py-3 px-4 text-muted-foreground">
                        {record.type}
                      </td>
                      <td className="py-3 px-4 font-bold text-chelsea-blue">
                        {record.value}
                      </td>
                      <td className="py-3 px-4">{record.holder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* Timeline */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Key Moments</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-chelsea-blue bg-chelsea-blue/10 rounded-full px-3 py-1 shrink-0">
                      {m.year}
                    </span>
                    <div className="w-px flex-1 bg-border mt-2" />
                  </div>
                  <p className="text-sm text-muted-foreground pb-4 pt-1">
                    {m.event}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
