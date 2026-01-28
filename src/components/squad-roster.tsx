"use client";

import { useState } from "react";
import type { SquadMember, LoanPlayer } from "@/lib/types";
import { PlayerCard } from "./player-card";
import { LoanPlayerCard } from "./loan-player-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { positionGroupLabel } from "@/lib/utils";

interface SquadRosterProps {
  grouped: Record<string, SquadMember[]>;
  loans: LoanPlayer[];
  photoUrls: Record<string, string>;
}

const TAB_ORDER = ["Goalkeeper", "Defence", "Midfield", "Offence", "loans"];

export function SquadRoster({ grouped, loans, photoUrls }: SquadRosterProps) {
  const [activeTab, setActiveTab] = useState("Goalkeeper");

  const availableTabs = TAB_ORDER.filter(
    (tab) => tab === "loans" ? loans.length > 0 : (grouped[tab]?.length ?? 0) > 0
  );

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab === "loans"
                ? `On Loan (${loans.length})`
                : positionGroupLabel(tab)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeTab === "loans"
          ? loans.map((player) => (
              <LoanPlayerCard key={player.name} player={player} photoUrl={photoUrls[player.name]} />
            ))
          : grouped[activeTab]?.map((player) => (
              <PlayerCard key={player.id} player={player} photoUrl={photoUrls[player.name]} />
            ))}
      </div>
    </div>
  );
}
