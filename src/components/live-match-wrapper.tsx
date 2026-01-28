"use client";

import { useState, useEffect, useCallback } from "react";
import type { MatchDetailResponse } from "@/lib/types";

interface LiveMatchWrapperProps {
  matchId: number;
  initialData: MatchDetailResponse;
  isLive: boolean;
  children: (data: MatchDetailResponse) => React.ReactNode;
}

export function LiveMatchWrapper({
  matchId,
  initialData,
  isLive,
  children,
}: LiveMatchWrapperProps) {
  const [data, setData] = useState(initialData);
  const [polling, setPolling] = useState(isLive);

  const fetchUpdate = useCallback(async () => {
    try {
      const res = await fetch(`/api/match/${matchId}`);
      if (!res.ok) return;
      const updated: MatchDetailResponse = await res.json();
      setData(updated);

      // Stop polling if match is finished
      if (updated.status === "FINISHED") {
        setPolling(false);
      }
    } catch {
      // Silently fail — next poll will retry
    }
  }, [matchId]);

  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(fetchUpdate, 30000);
    return () => clearInterval(interval);
  }, [polling, fetchUpdate]);

  return <>{children(data)}</>;
}
